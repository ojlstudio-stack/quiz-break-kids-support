import SwiftUI

/// 차단 화면에서 넘어온 아이가 푸는 퀴즈.
/// 맞히면 ShieldController 가 보상 시간만큼 차단을 푼다.
public struct QuizGateView: View {

    public struct Question {
        public let prompt: String
        public let choices: [String]
        public let answerIndex: Int

        public init(prompt: String, choices: [String], answerIndex: Int) {
            self.prompt = prompt
            self.choices = choices
            self.answerIndex = answerIndex
        }
    }

    private let question: Question
    private let onSolved: () -> Void

    @State private var picked: Int?
    @State private var wrongAttempts = 0

    public init(question: Question, onSolved: @escaping () -> Void) {
        self.question = question
        self.onSolved = onSolved
    }

    public var body: some View {
        VStack(spacing: 28) {
            Spacer()

            Text(question.prompt)
                .font(.title2.weight(.bold))
                .multilineTextAlignment(.center)
                .padding(.horizontal)

            VStack(spacing: 12) {
                ForEach(question.choices.indices, id: \.self) { index in
                    choiceButton(index)
                }
            }
            .padding(.horizontal)

            if wrongAttempts > 0 {
                Text("다시 한 번 생각해 볼까요?")
                    .font(.footnote)
                    .foregroundStyle(.secondary)
            }

            Spacer()
        }
        .background(Color(red: 0.97, green: 0.96, blue: 1.0))
    }

    private func choiceButton(_ index: Int) -> some View {
        Button {
            select(index)
        } label: {
            Text(question.choices[index])
                .font(.body.weight(.medium))
                .frame(maxWidth: .infinity)
                .padding(.vertical, 16)
                .background(background(for: index))
                .foregroundStyle(picked == index ? .white : .primary)
                .clipShape(RoundedRectangle(cornerRadius: 16))
        }
        .disabled(picked == question.answerIndex)
    }

    private func background(for index: Int) -> Color {
        guard picked == index else { return .white }
        return index == question.answerIndex
            ? Color(red: 0.2, green: 0.75, blue: 0.45)
            : Color(red: 0.9, green: 0.35, blue: 0.4)
    }

    private func select(_ index: Int) {
        picked = index

        guard index == question.answerIndex else {
            wrongAttempts += 1
            // 틀리면 잠깐 뒤에 다시 고를 수 있게 돌려놓는다.
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.8) {
                picked = nil
            }
            return
        }

        ShieldController.shared.unlockForQuizReward()

        DispatchQueue.main.asyncAfter(deadline: .now() + 0.6) {
            onSolved()
        }
    }
}
