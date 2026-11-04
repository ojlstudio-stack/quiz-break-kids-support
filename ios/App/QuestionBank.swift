import Foundation

/// 문제를 꺼내오는 곳. 지금은 코드 안에 든 표본만 들고 있다.
/// 실제 문제 묶음이 생기면 `loadBundled()` 가 읽는 JSON 만 갈아끼우면 된다.
public final class QuestionBank {

    public static let shared = QuestionBank()

    private var questions: [Question]

    private init() {
        questions = Self.loadBundled() ?? Self.sample
    }

    /// 연령대와 과목으로 걸러 무작위로 뽑는다.
    public func draw(count: Int, subjectIDs: Set<String>? = nil) -> [Question] {
        let pool = subjectIDs.map { ids in
            questions.filter { ids.contains($0.subjectID) }
        } ?? questions

        guard !pool.isEmpty else { return [] }
        return Array(pool.shuffled().prefix(count))
    }

    /// Questions.json 이 번들에 있으면 그걸 쓴다.
    private static func loadBundled() -> [Question]? {
        guard let url = Bundle.main.url(forResource: "Questions", withExtension: "json"),
              let data = try? Data(contentsOf: url),
              let decoded = try? JSONDecoder().decode([Question].self, from: data),
              !decoded.isEmpty
        else { return nil }
        return decoded
    }

    private static let sample: [Question] = [
        .init(subjectID: "math", prompt: "7 + 5 는 얼마일까요?",
              choices: ["10", "11", "12", "13"], answerIndex: 2),
        .init(subjectID: "math", prompt: "3 × 4 는 얼마일까요?",
              choices: ["7", "12", "14", "9"], answerIndex: 1),
        .init(subjectID: "math", prompt: "20 - 8 은 얼마일까요?",
              choices: ["12", "11", "13", "14"], answerIndex: 0),
        .init(subjectID: "korean", prompt: "'사과'의 첫 글자 받침은 무엇일까요?",
              choices: ["ㄱ", "ㄴ", "없음", "ㅅ"], answerIndex: 2),
        .init(subjectID: "english", prompt: "'고양이'를 영어로 하면?",
              choices: ["dog", "cat", "cow", "bird"], answerIndex: 1),
        .init(subjectID: "science", prompt: "물이 얼면 무엇이 될까요?",
              choices: ["수증기", "얼음", "구름", "비"], answerIndex: 1),
        .init(subjectID: "society", prompt: "우리나라의 수도는 어디일까요?",
              choices: ["부산", "서울", "대구", "인천"], answerIndex: 1)
    ]
}
