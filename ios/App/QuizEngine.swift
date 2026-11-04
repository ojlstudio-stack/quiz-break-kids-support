import Foundation
import SwiftUI

// MARK: - 모델

public struct Subject: Identifiable, Hashable, Codable {
    public let id: String
    public let name: String
    public let symbol: String

    public init(id: String, name: String, symbol: String) {
        self.id = id
        self.name = name
        self.symbol = symbol
    }

    public static let all: [Subject] = [
        .init(id: "math",    name: "수학",   symbol: "function"),
        .init(id: "korean",  name: "국어",   symbol: "textformat.kr"),
        .init(id: "english", name: "영어",   symbol: "character.book.closed"),
        .init(id: "science", name: "과학",   symbol: "atom"),
        .init(id: "society", name: "사회",   symbol: "globe.asia.australia")
    ]
}

public struct Question: Identifiable, Hashable, Codable {
    public let id: UUID
    public let subjectID: String
    public let prompt: String
    public let choices: [String]
    public let answerIndex: Int

    public init(id: UUID = UUID(), subjectID: String, prompt: String, choices: [String], answerIndex: Int) {
        self.id = id
        self.subjectID = subjectID
        self.prompt = prompt
        self.choices = choices
        self.answerIndex = answerIndex
    }
}

/// 한 과목의 누적 성적. 홈 화면의 "약한 과목" 줄에 쓰인다.
public struct SubjectRecord: Codable {
    public var solved: Int = 0
    public var correct: Int = 0

    public var accuracy: Double {
        solved == 0 ? 1 : Double(correct) / Double(solved)
    }
}

// MARK: - 엔진

/// 점수·스트릭·세션 진행을 들고 있는 하나뿐인 상태.
/// 차단 해제 퀴즈와 자유 연습 퀴즈가 같은 엔진을 쓴다.
@MainActor
public final class QuizEngine: ObservableObject {

    public static let shared = QuizEngine()

    // 한 판(세션) 안에서만 살아 있는 값
    @Published public private(set) var session: Session?

    // 날마다 쌓이는 값
    @Published public private(set) var solvedToday: Int = 0
    @Published public private(set) var dailyGoal: Int = 10
    @Published public private(set) var streakDays: Int = 0
    @Published public private(set) var records: [String: SubjectRecord] = [:]

    public struct Session {
        public var questions: [Question]
        public var index: Int = 0
        public var score: Int = 0
        public var combo: Int = 0
        public var bestCombo: Int = 0

        public var current: Question? {
            index < questions.count ? questions[index] : nil
        }
        public var isFinished: Bool { index >= questions.count }
        public var progress: Double {
            questions.isEmpty ? 0 : Double(index) / Double(questions.count)
        }
    }

    private init() {
        load()
        rolloverIfNewDay()
    }

    // MARK: 오늘 진행률

    /// 홈 화면 가운데 고리에 들어가는 값.
    public var dailyProgress: Double {
        dailyGoal == 0 ? 0 : min(Double(solvedToday) / Double(dailyGoal), 1)
    }

    public var goalReached: Bool { solvedToday >= dailyGoal }

    /// 전체 정답률.
    public var overallAccuracy: Double {
        let solved = records.values.reduce(0) { $0 + $1.solved }
        let correct = records.values.reduce(0) { $0 + $1.correct }
        return solved == 0 ? 1 : Double(correct) / Double(solved)
    }

    /// 정답률이 낮은 순. Brainrot 의 "Top Offenders" 자리.
    public func weakestSubjects(limit: Int = 3) -> [(Subject, SubjectRecord)] {
        Subject.all
            .compactMap { subject in
                guard let record = records[subject.id], record.solved > 0 else { return nil }
                return (subject, record)
            }
            .sorted { $0.1.accuracy < $1.1.accuracy }
            .prefix(limit)
            .map { $0 }
    }

    // MARK: 한 판

    public func start(questions: [Question]) {
        session = Session(questions: questions)
    }

    /// 답을 고른다. 맞았는지 돌려준다.
    @discardableResult
    public func answer(_ choiceIndex: Int) -> Bool {
        guard var s = session, let question = s.current else { return false }

        let isCorrect = choiceIndex == question.answerIndex

        var record = records[question.subjectID] ?? SubjectRecord()
        record.solved += 1
        if isCorrect { record.correct += 1 }
        records[question.subjectID] = record

        if isCorrect {
            s.combo += 1
            s.bestCombo = max(s.bestCombo, s.combo)
            s.score += points(forCombo: s.combo)
            solvedToday += 1
        } else {
            s.combo = 0
        }

        s.index += 1
        session = s

        if goalReached { bumpStreakIfNeeded() }
        save()

        return isCorrect
    }

    public func endSession() {
        session = nil
    }

    /// 연속 정답이 쌓일수록 더 준다. 3연속부터 보너스.
    private func points(forCombo combo: Int) -> Int {
        switch combo {
        case 0...2:  return 10
        case 3...4:  return 15
        case 5...7:  return 20
        default:     return 30
        }
    }

    // MARK: 저장

    private enum Key {
        static let solvedToday = "engine.solvedToday"
        static let dailyGoal = "engine.dailyGoal"
        static let streakDays = "engine.streakDays"
        static let records = "engine.records"
        static let lastActiveDay = "engine.lastActiveDay"
        static let lastStreakDay = "engine.lastStreakDay"
    }

    private let defaults = UserDefaults(suiteName: QuizBreak.appGroupID) ?? .standard

    private func load() {
        solvedToday = defaults.integer(forKey: Key.solvedToday)
        let goal = defaults.integer(forKey: Key.dailyGoal)
        dailyGoal = goal == 0 ? 10 : goal
        streakDays = defaults.integer(forKey: Key.streakDays)

        if let data = defaults.data(forKey: Key.records),
           let decoded = try? JSONDecoder().decode([String: SubjectRecord].self, from: data) {
            records = decoded
        }
    }

    private func save() {
        defaults.set(solvedToday, forKey: Key.solvedToday)
        defaults.set(dailyGoal, forKey: Key.dailyGoal)
        defaults.set(streakDays, forKey: Key.streakDays)
        defaults.set(Self.dayStamp(Date()), forKey: Key.lastActiveDay)
        if let data = try? JSONEncoder().encode(records) {
            defaults.set(data, forKey: Key.records)
        }
    }

    public func setDailyGoal(_ goal: Int) {
        dailyGoal = max(1, goal)
        save()
    }

    /// 날이 바뀌면 오늘 센 숫자를 0으로. 하루를 건너뛰었으면 스트릭도 끊는다.
    private func rolloverIfNewDay() {
        let today = Self.dayStamp(Date())
        let lastActive = defaults.integer(forKey: Key.lastActiveDay)
        guard lastActive != 0, lastActive != today else { return }

        solvedToday = 0

        let lastStreak = defaults.integer(forKey: Key.lastStreakDay)
        if lastStreak != today && lastStreak != Self.dayStamp(Date().addingTimeInterval(-86_400)) {
            streakDays = 0
        }
        save()
    }

    /// 오늘 목표를 처음 채웠을 때만 스트릭을 하루 올린다.
    private func bumpStreakIfNeeded() {
        let today = Self.dayStamp(Date())
        guard defaults.integer(forKey: Key.lastStreakDay) != today else { return }
        streakDays += 1
        defaults.set(today, forKey: Key.lastStreakDay)
    }

    /// 날짜를 yyyyMMdd 정수 하나로. 비교만 하면 되니 이걸로 충분하다.
    private static func dayStamp(_ date: Date) -> Int {
        let c = Calendar.current.dateComponents([.year, .month, .day], from: date)
        return (c.year ?? 0) * 10_000 + (c.month ?? 0) * 100 + (c.day ?? 0)
    }
}
