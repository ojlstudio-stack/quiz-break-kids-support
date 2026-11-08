import SwiftUI

/// 차단 화면에서 넘어온 아이가 푸는 판.
/// 위쪽에 진행 바·점수·콤보가 붙어 있어서 풀이가 게임처럼 보인다.
public struct QuizGameView: View {

    @ObservedObject private var engine = QuizEngine.shared
    @Environment(\.dismiss) private var dismiss

    @State private var picked: Int?
    @State private var locked = false
    @State private var comboPulse = false
    @State private var scorePop: Int?
    @State private var shake = false

    public init() {}

    public var body: some View {
        ZStack {
            backdrop

            if let session = engine.session, let question = session.current {
                playing(session: session, question: question)
            } else {
                finished
            }
        }
    }

    /// 콤보가 붙으면 아래쪽이 조금씩 달아오른다.
    private var backdrop: some View {
        let heat = min(Double(engine.session?.combo ?? 0) / 8.0, 1.0)
        return ZStack {
            Palette.canvas
            LinearGradient(
                colors: [.clear, Palette.streak.opacity(0.14 * heat)],
                startPoint: .top,
                endPoint: .bottom
            )
        }
        .ignoresSafeArea()
        .animation(.easeInOut(duration: 0.4), value: engine.session?.combo)
    }

    // MARK: 푸는 중

    private func playing(session: QuizEngine.Session, question: Question) -> some View {
        VStack(spacing: 0) {
            topBar(session)

            Spacer(minLength: 12)

            Mascot(size: 68, mood: .thinking)
                .padding(.bottom, 18)

            promptText(question)
                .padding(.horizontal, 24)
                .offset(x: shake ? -8 : 0)
                .animation(
                    shake ? .linear(duration: 0.06).repeatCount(5, autoreverses: true) : .default,
                    value: shake
                )

            Spacer(minLength: 20)

            VStack(spacing: 10) {
                ForEach(question.choices.indices, id: \.self) { index in
                    choiceButton(index, question: question)
                }
            }
            .padding(.horizontal, Metric.gutter)
            .padding(.bottom, 28)
        }
    }

    /// 숫자 문제는 수식이 크게 보이도록 한 단계 키운다.
    @ViewBuilder
    private func promptText(_ question: Question) -> some View {
        let isNumeric = question.subjectID == "math"

        Text(question.prompt)
            .font(.system(
                size: isNumeric ? 32 : 22,
                weight: isNumeric ? .black : .bold,
                design: .rounded
            ))
            .foregroundStyle(Palette.ink)
            .multilineTextAlignment(.center)
            .minimumScaleFactor(0.6)
    }

    private func topBar(_ session: QuizEngine.Session) -> some View {
        VStack(spacing: 12) {
            HStack(spacing: 10) {
                Text("\(session.index + 1) / \(session.questions.count)")
                    .font(.system(size: 13, weight: .bold, design: .rounded))
                    .foregroundStyle(Palette.inkSoft)

                Spacer()

                ZStack(alignment: .trailing) {
                    Text("\(session.score)점")
                        .font(.system(size: 17, weight: .heavy, design: .rounded))
                        .foregroundStyle(Palette.ink)

                    if let gained = scorePop {
                        Text("+\(gained)")
                            .font(.system(size: 15, weight: .heavy, design: .rounded))
                            .foregroundStyle(Palette.correct)
                            .offset(y: -22)
                            .transition(.opacity.combined(with: .move(edge: .bottom)))
                    }
                }

                if session.combo >= 2 {
                    HStack(spacing: 3) {
                        Image(systemName: "flame.fill").font(.system(size: 11, weight: .bold))
                        Text("\(session.combo)").font(.system(size: 14, weight: .heavy, design: .rounded))
                    }
                    .foregroundStyle(.white)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 5)
                    .background(Capsule().fill(Palette.streak))
                    .scaleEffect(comboPulse ? 1.2 : 1)
                    .animation(.spring(response: 0.3, dampingFraction: 0.45), value: comboPulse)
                }
            }

            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    Capsule().fill(Palette.hairline)
                    Capsule()
                        .fill(
                            LinearGradient(
                                colors: [Palette.brand, Palette.brandDeep],
                                startPoint: .leading, endPoint: .trailing
                            )
                        )
                        .frame(width: geo.size.width * session.progress)
                        .animation(.spring(response: 0.45, dampingFraction: 0.8), value: session.progress)
                }
            }
            .frame(height: 9)
        }
        .padding(.horizontal, Metric.gutter)
        .padding(.top, 14)
    }

    private func choiceButton(_ index: Int, question: Question) -> some View {
        Button {
            select(index, question: question)
        } label: {
            HStack {
                Text(question.choices[index])
                    .font(.system(size: 19, weight: .bold, design: .rounded))
                Spacer()
                if picked == index {
                    Image(systemName: index == question.answerIndex ? "checkmark" : "xmark")
                        .font(.system(size: 16, weight: .black))
                }
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 19)
            .frame(maxWidth: .infinity)
            .background(background(for: index, question: question))
            .foregroundStyle(picked == index ? .white : Palette.ink)
            .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: 18, style: .continuous)
                    .stroke(Palette.hairline, lineWidth: picked == index ? 0 : 1)
            )
            .shadow(
                color: picked == index ? background(for: index, question: question).opacity(0.35) : .clear,
                radius: 10, y: 4
            )
        }
        .disabled(locked)
        .scaleEffect(picked == index ? 1.03 : 1)
        .animation(.spring(response: 0.25, dampingFraction: 0.55), value: picked)
    }

    private func background(for index: Int, question: Question) -> Color {
        guard picked == index else { return Palette.surface }
        return index == question.answerIndex ? Palette.correct : Palette.wrong
    }

    // MARK: 끝난 뒤

    private var finished: some View {
        VStack(spacing: 20) {
            Mascot(size: 112, mood: .happy)

            Text("잠금이 풀렸어요!")
                .font(.system(size: 27, weight: .heavy, design: .rounded))
                .foregroundStyle(Palette.ink)

            Text("\(SharedStore.intervalMinutes)분 뒤에 다시 만나요")
                .font(.system(size: 15, weight: .medium))
                .foregroundStyle(Palette.inkSoft)

            Button {
                engine.endSession()
                dismiss()
            } label: {
                Text("닫기")
                    .font(.system(size: 17, weight: .bold, design: .rounded))
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 17)
                    .background(Palette.brand)
                    .foregroundStyle(.white)
                    .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
            }
            .padding(.horizontal, 40)
            .padding(.top, 10)
        }
    }

    // MARK: 고르기

    private func select(_ index: Int, question: Question) {
        guard !locked else { return }
        locked = true
        picked = index

        let scoreBefore = engine.session?.score ?? 0
        let wasCorrect = engine.answer(index)
        let gained = (engine.session?.score ?? 0) - scoreBefore

        if wasCorrect {
            comboPulse.toggle()
            withAnimation(.spring(response: 0.3, dampingFraction: 0.6)) { scorePop = gained }
            UIImpactFeedbackGenerator(style: .medium).impactOccurred()
        } else {
            shake = true
            UINotificationFeedbackGenerator().notificationOccurred(.warning)
        }

        DispatchQueue.main.asyncAfter(deadline: .now() + 0.8) {
            withAnimation { scorePop = nil }
            picked = nil
            shake = false
            locked = false

            // 다 풀었으면 실제로 잠금을 연다.
            if engine.session?.isFinished == true {
                ShieldController.shared.unlockForQuizReward()
            }
        }
    }
}
