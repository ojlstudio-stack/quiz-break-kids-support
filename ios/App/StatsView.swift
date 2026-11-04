import SwiftUI

/// 과목별로 얼마나 풀었고 얼마나 맞혔는지.
public struct StatsView: View {

    @ObservedObject private var engine = QuizEngine.shared

    public init() {}

    public var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                summaryCard
                subjectsCard
                goalCard
                Color.clear.frame(height: 12)
            }
            .padding(.horizontal, Metric.gutter)
            .padding(.top, 8)
        }
        .background(Palette.canvas.ignoresSafeArea())
    }

    private var summaryCard: some View {
        Card {
            HStack(spacing: 10) {
                StatTile(
                    symbol: "checkmark.seal.fill",
                    value: "\(Int(engine.overallAccuracy * 100))%",
                    caption: "전체 정답률",
                    tint: Palette.correct
                )
                StatTile(
                    symbol: "pencil.and.list.clipboard",
                    value: "\(totalSolved)",
                    caption: "누적 문제"
                )
                StatTile(
                    symbol: "flame.fill",
                    value: "\(engine.streakDays)일",
                    caption: "연속 달성",
                    tint: Palette.streak
                )
            }
        }
    }

    private var subjectsCard: some View {
        Card {
            VStack(alignment: .leading, spacing: 16) {
                Text("과목별 기록")
                    .font(.system(size: 16, weight: .bold, design: .rounded))
                    .foregroundStyle(Palette.ink)

                ForEach(Subject.all) { subject in
                    let record = engine.records[subject.id] ?? SubjectRecord()
                    HStack(spacing: 12) {
                        Image(systemName: subject.symbol)
                            .font(.system(size: 15, weight: .semibold))
                            .foregroundStyle(Palette.brand)
                            .frame(width: 30)

                        Text(subject.name)
                            .font(.system(size: 15, weight: .semibold))
                            .foregroundStyle(Palette.ink)

                        Spacer()

                        if record.solved == 0 {
                            Text("기록 없음")
                                .font(.system(size: 13))
                                .foregroundStyle(Palette.inkSoft)
                        } else {
                            Text("\(record.correct) / \(record.solved)")
                                .font(.system(size: 14, weight: .heavy, design: .rounded))
                                .foregroundStyle(Palette.ink)
                        }
                    }
                }
            }
        }
    }

    private var goalCard: some View {
        Card {
            VStack(alignment: .leading, spacing: 12) {
                Text("하루 목표")
                    .font(.system(size: 16, weight: .bold, design: .rounded))
                    .foregroundStyle(Palette.ink)

                Picker("하루 목표", selection: Binding(
                    get: { engine.dailyGoal },
                    set: { engine.setDailyGoal($0) }
                )) {
                    ForEach([5, 10, 15, 20, 30], id: \.self) { goal in
                        Text("\(goal)문제").tag(goal)
                    }
                }
                .pickerStyle(.segmented)
            }
        }
    }

    private var totalSolved: Int {
        engine.records.values.reduce(0) { $0 + $1.solved }
    }
}
