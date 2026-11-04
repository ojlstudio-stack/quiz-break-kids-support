import SwiftUI

/// 홈. 위에서부터 인사줄 → 마스코트와 오늘 진행률 → 스탯 타일 셋 → 약한 과목.
public struct HomeView: View {

    @ObservedObject private var engine = QuizEngine.shared
    @State private var showQuiz = false

    public init() {}

    public var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                header
                todayCard
                statRow
                weakSubjectsCard
                Color.clear.frame(height: 12)
            }
            .padding(.horizontal, Metric.gutter)
        }
        .background(Palette.canvas.ignoresSafeArea())
        .fullScreenCover(isPresented: $showQuiz) {
            QuizGameView(mode: .practice)
        }
    }

    // MARK: 줄별

    private var header: some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text("오늘도 한 걸음")
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundStyle(Palette.inkSoft)
                Text("퀴즈 브레이크")
                    .font(.system(size: 24, weight: .heavy, design: .rounded))
                    .foregroundStyle(Palette.ink)
            }
            Spacer()
            StreakBadge(days: engine.streakDays)
        }
        .padding(.top, 8)
    }

    private var todayCard: some View {
        Card {
            VStack(spacing: 18) {
                HStack(spacing: 20) {
                    Mascot(size: 84, mood: engine.goalReached ? .happy : .idle)

                    VStack(alignment: .leading, spacing: 6) {
                        Text(engine.goalReached ? "오늘 목표 끝!" : "오늘의 목표")
                            .font(.system(size: 17, weight: .bold, design: .rounded))
                            .foregroundStyle(Palette.ink)

                        Text("\(engine.solvedToday) / \(engine.dailyGoal) 문제")
                            .font(.system(size: 14, weight: .medium))
                            .foregroundStyle(Palette.inkSoft)
                    }

                    Spacer()

                    ProgressRing(progress: engine.dailyProgress)
                        .frame(width: 92, height: 92)
                }

                Button {
                    startPractice()
                } label: {
                    Text(engine.goalReached ? "더 풀어보기" : "퀴즈 풀기")
                        .font(.system(size: 16, weight: .bold, design: .rounded))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 15)
                        .background(Palette.brand)
                        .foregroundStyle(.white)
                        .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
                }
            }
        }
    }

    private var statRow: some View {
        HStack(spacing: 10) {
            StatTile(
                symbol: "checkmark.seal.fill",
                value: "\(Int(engine.overallAccuracy * 100))%",
                caption: "정답률",
                tint: Palette.correct
            )
            StatTile(
                symbol: "pencil.and.list.clipboard",
                value: "\(engine.records.values.reduce(0) { $0 + $1.solved })",
                caption: "푼 문제"
            )
            StatTile(
                symbol: "flame.fill",
                value: "\(engine.streakDays)일",
                caption: "연속 달성",
                tint: Palette.streak
            )
        }
    }

    @ViewBuilder
    private var weakSubjectsCard: some View {
        let weak = engine.weakestSubjects()

        Card {
            VStack(alignment: .leading, spacing: 14) {
                Text("더 연습하면 좋을 과목")
                    .font(.system(size: 16, weight: .bold, design: .rounded))
                    .foregroundStyle(Palette.ink)

                if weak.isEmpty {
                    Text("아직 기록이 없어요. 퀴즈를 풀면 여기에 쌓입니다.")
                        .font(.system(size: 13))
                        .foregroundStyle(Palette.inkSoft)
                } else {
                    ForEach(weak, id: \.0.id) { subject, record in
                        subjectRow(subject, record)
                    }
                }
            }
        }
    }

    private func subjectRow(_ subject: Subject, _ record: SubjectRecord) -> some View {
        HStack(spacing: 12) {
            Image(systemName: subject.symbol)
                .font(.system(size: 15, weight: .semibold))
                .foregroundStyle(Palette.brand)
                .frame(width: 34, height: 34)
                .background(Palette.canvas)
                .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))

            VStack(alignment: .leading, spacing: 4) {
                Text(subject.name)
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundStyle(Palette.ink)

                GeometryReader { geo in
                    ZStack(alignment: .leading) {
                        Capsule().fill(Palette.hairline)
                        Capsule()
                            .fill(record.accuracy < 0.6 ? Palette.wrong : Palette.brand)
                            .frame(width: geo.size.width * record.accuracy)
                    }
                }
                .frame(height: 6)
            }

            Text("\(Int(record.accuracy * 100))%")
                .font(.system(size: 14, weight: .heavy, design: .rounded))
                .foregroundStyle(Palette.inkSoft)
                .frame(width: 44, alignment: .trailing)
        }
    }

    private func startPractice() {
        engine.start(questions: QuestionBank.shared.draw(count: 5))
        showQuiz = true
    }
}
