import Foundation

/// 문제를 꺼내오는 곳. 지금은 코드 안에 든 표본만 들고 있다.
/// 실제 문제 묶음이 생기면 번들에 Questions.json 을 넣으면 그쪽을 쓴다.
public final class QuestionBank {

    public static let shared = QuestionBank()

    private var questions: [Question]

    private init() {
        questions = Self.loadBundled() ?? Self.sample
    }

    /// 부모가 설정한 연령과 과목에 맞는 문제만 뽑는다.
    /// 조건에 맞는 게 모자라면 연령만 맞춰서 채우고, 그래도 없으면 전체에서 채운다.
    public func draw(count: Int,
                     ageGroup: AgeGroup = SharedStore.ageGroup,
                     subjectIDs: Set<String> = SharedStore.subjectIDs) -> [Question] {

        let byAge = questions.filter { $0.fits(ageGroup) }

        let wanted = subjectIDs.isEmpty
            ? byAge
            : byAge.filter { subjectIDs.contains($0.subjectID) }

        var picked = Array(wanted.shuffled().prefix(count))

        if picked.count < count {
            let ids = Set(picked.map(\.id))
            picked += byAge.filter { !ids.contains($0.id) }
                           .shuffled()
                           .prefix(count - picked.count)
        }

        if picked.count < count {
            let ids = Set(picked.map(\.id))
            picked += questions.filter { !ids.contains($0.id) }
                               .shuffled()
                               .prefix(count - picked.count)
        }

        return picked
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
        // 2~5세
        .init(subjectID: "math", ageMin: 2, ageMax: 5, prompt: "사과가 2개, 1개 더 있으면 몇 개일까요?",
              choices: ["2개", "3개", "4개"], answerIndex: 1),
        .init(subjectID: "korean", ageMin: 2, ageMax: 5, prompt: "'가'로 시작하는 것은 무엇일까요?",
              choices: ["나비", "가방", "토끼"], answerIndex: 1),

        // 6~8세
        .init(subjectID: "math", ageMin: 6, ageMax: 8, prompt: "7 + 5 는 얼마일까요?",
              choices: ["10", "11", "12", "13"], answerIndex: 2),
        .init(subjectID: "math", ageMin: 6, ageMax: 8, prompt: "3 × 4 는 얼마일까요?",
              choices: ["7", "12", "14", "9"], answerIndex: 1),
        .init(subjectID: "english", ageMin: 6, ageMax: 8, prompt: "'고양이'를 영어로 하면?",
              choices: ["dog", "cat", "cow", "bird"], answerIndex: 1),
        .init(subjectID: "science", ageMin: 6, ageMax: 8, prompt: "물이 얼면 무엇이 될까요?",
              choices: ["수증기", "얼음", "구름", "비"], answerIndex: 1),

        // 9~12세
        .init(subjectID: "math", ageMin: 9, ageMax: 12, prompt: "144 ÷ 12 는 얼마일까요?",
              choices: ["11", "12", "13", "14"], answerIndex: 1),
        .init(subjectID: "society", ageMin: 9, ageMax: 12, prompt: "우리나라의 수도는 어디일까요?",
              choices: ["부산", "서울", "대구", "인천"], answerIndex: 1),
        .init(subjectID: "science", ageMin: 9, ageMax: 12, prompt: "식물이 빛으로 양분을 만드는 과정은?",
              choices: ["증산작용", "광합성", "호흡", "발효"], answerIndex: 1),

        // 13~17세
        .init(subjectID: "math", ageMin: 13, ageMax: 17, prompt: "x + 7 = 15 일 때 x 는?",
              choices: ["6", "7", "8", "9"], answerIndex: 2),
        .init(subjectID: "english", ageMin: 13, ageMax: 17, prompt: "'She ___ to school every day.' 알맞은 것은?",
              choices: ["go", "goes", "going", "gone"], answerIndex: 1),
        .init(subjectID: "science", ageMin: 13, ageMax: 17, prompt: "물의 화학식은 무엇일까요?",
              choices: ["CO2", "H2O", "O2", "NaCl"], answerIndex: 1)
    ]
}
