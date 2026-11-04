import SwiftUI

/// 퀴즈 한 판. 차단 해제용과 자유 연습용이 같은 화면을 쓴다.
/// 위쪽에 진행 바·점수·콤보가 붙어 있어서 풀이가 게임처럼 보인다.
public struct QuizGameView: View {

    public enum Mode {
        /// 차단을 풀려고 푸는 판. 다 맞히면 ShieldController 가 앱을 열어준다.
        case unlockShield
        /// 그냥 연습.
        case practice
    }

    @ObservedObject private var engine = QuizEngine.shared
    @Environment(\.dismiss) private var dismiss

    private let mode: Mode

    @State private var picked: Int?
    @State private var locked = false
    @State private var comboFlash = false

    public init(mode: Mode) {
        self.mode = mode
    }

    public var body: some View {
        ZStack {
            Palette.canvas.ignoresSafeArea()

            if let session = engine.session, let question = session.current {
                playing(session: session, question: question)
            } else {
                finished
            }
        }
    }

    // MARK: 푸는 중

    private func playing(session: QuizEngine.Session, question: Question) -> some View {
        VStack(spacing: 0) {
            topBar(session)

            Spacer(minLength: 16)

            Mascot(size: 76, mood: .thinking)
                .padding(.bottom, 20)

            Text(question.prompt)
                .font(.system(size: 22, weight: .bold, design: .rounded))
                .foregroundStyle(Palette.ink)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 28)

            Spacer(minLength: 24)

            VStack(spacing: 10) {
                ForEach(question.choices.indices, id: \.self) { index in
                    choiceButton(index, question: question)
                }
            }
            .padding(.horizontal, Metric.gutter)
            .padding(.bottom, 32)
        }
    }

    private func topBar(_ session: QuizEngine.Session) -> some View {
        VStack(spacing: 12) {
            HStack {
                if mode == .practice {
                    Button {
                        engine.endSession()
                        dismiss()
                    } label: {
                        Image(systemName: "xmark")
                            .font(.system(size: 15, weight: .bold))
                            .foregroundStyle(Palette.inkSoft)
                            .frame(width: 34, height: 34)
                            .background(Palette.surface)
                            .clipShape(Circle())
                    }
                }

                Spacer()

                Text("\(session.score)점")
                    .font(.system(size: 16, weight: .heavy, design: .rounded))
                    .foregroundStyle(Palette.ink)

                if session.combo >= 2 {
                    Text("\(session.combo)연속")
                        .font(.system(size: 13, weight: .heavy, design: .rounded))
                        .foregroundStyle(.white)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 5)
                        .background(Capsule().fill(Palette.streak))
                        .scaleEffect(comboFlash ? 1.18 : 1)
                        .animation(.spring(response: 0.3, dampingFraction: 0.5), value: comboFlash)
                }
            }

            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    Capsule().fill(Palette.hairline)
                    Capsule()
                        .fill(Palette.brand)
                        .frame(width: geo.size.width * session.progress)
                        .animation(.spring(response: 0.4, dampingFraction: 0.8), value: session.progress)
                }
            }
            .frame(height: 8)
        }
        .padding(.horizontal, Metric.gutter)
        .padding(.top, 12)
    }

    private func choiceButton(_ index: Int, question: Question) -> some View {
        Button {
            select(index, question: question)
        } label: {
            HStack {
                Text(question.choices[index])
                    .font(.system(size: 17, weight: .semibold, design: .rounded))
                Spacer()
                if picked == index {
                    Image(systemName: index == question.answerIndex ? "checkmark" : "xmark")
                        .font(.system(size: 15, weight: .bold))
                }
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 18)
            .frame(maxWidth: .infinity)
            .background(background(for: index, question: question))
            .foregroundStyle(picked == index ? .white : Palette.ink)
            .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: 16, style: .continuous)
                    .stroke(Palette.hairline, lineWidth: picked == index ? 0 : 1)
            )
        }
        .disabled(locked)
        .scaleEffect(picked == index ? 0.97 : 1)
        .animation(.spring(response: 0.25, dampingFraction: 0.6), value: picked)
    }

    private func background(for index: Int, question: Question) -> Color {
        guard picked == index else { return Palette.surface }
        return index == question.answerIndex ? Palette.correct : Palette.wrong
    }

    // MARK: 끝난 뒤

    private var finished: some View {
        VStack(spacing: 22) {
            Mascot(size: 110, mood: .happy)

            Text(mode == .unlockShield ? "잠금이 풀렸어요!" : "잘했어요!")
                .font(.system(size: 26, weight: .heavy, design: .rounded))
                .foregroundStyle(Palette.ink)

            if mode == .unlockShield {
                Text("\(SharedStore.unlockMinutes)분 동안 앱을 쓸 수 있어요")
                    .font(.system(size: 15, weight: .medium))
                    .foregroundStyle(Palette.inkSoft)
            }

            Button {
                engine.endSession()
                dismiss()
            } label: {
                Text("닫기")
                    .font(.system(size: 16, weight: .bold, design: .rounded))
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(Palette.brand)
                    .foregroundStyle(.white)
                    .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
            }
            .padding(.horizontal, 40)
            .padding(.top, 8)
        }
    }

    // MARK: 고르기

    private func select(_ index: Int, question: Question) {
        guard !locked else { return }
        locked = true
        picked = index

        let wasCorrect = engine.answer(index)

        if wasCorrect {
            comboFlash.toggle()
            UIImpactFeedbackGenerator(style: .light).impactOccurred()
        } else {
            UINotificationFeedbackGenerator().notificationOccurred(.warning)
        }

        DispatchQueue.main.asyncAfter(deadline: .now() + 0.75) {
            picked = nil
            locked = false

            // 차단 해제 판은 다 풀었을 때 실제로 잠금을 연다.
            if mode == .unlockShield, engine.session?.isFinished == true {
                ShieldController.shared.unlockForQuizReward()
            }
        }
    }
}
