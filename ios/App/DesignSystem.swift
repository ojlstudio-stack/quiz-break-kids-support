import SwiftUI

/// 앱 전체가 공유하는 색·간격·모양.
/// 지원 사이트(index.html)의 보라 계열을 그대로 가져왔다.
public enum Palette {
    public static let brand       = Color(red: 0.486, green: 0.361, blue: 1.0)   // #7C5CFF
    public static let brandDeep   = Color(red: 0.353, green: 0.235, blue: 0.835)
    public static let canvas      = Color(red: 0.969, green: 0.961, blue: 1.0)   // #F7F5FF
    public static let surface     = Color.white
    public static let ink         = Color(red: 0.231, green: 0.200, blue: 0.333) // #3B3355
    public static let inkSoft     = Color(red: 0.541, green: 0.510, blue: 0.651)
    public static let hairline    = Color(red: 0.906, green: 0.890, blue: 0.957) // #E7E3F4
    public static let correct     = Color(red: 0.200, green: 0.750, blue: 0.450)
    public static let wrong       = Color(red: 0.902, green: 0.350, blue: 0.400)
    public static let streak      = Color(red: 1.0,   green: 0.580, blue: 0.180)
}

public enum Metric {
    public static let cardRadius: CGFloat = 22
    public static let tileRadius: CGFloat = 18
    public static let gutter: CGFloat = 20
}

// MARK: - 카드

/// 흰 배경에 가는 테두리를 두른 기본 묶음. 홈 화면의 모든 블록이 이걸 쓴다.
public struct Card<Content: View>: View {
    private let content: Content

    public init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }

    public var body: some View {
        content
            .padding(Metric.gutter)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(Palette.surface)
            .clipShape(RoundedRectangle(cornerRadius: Metric.cardRadius, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: Metric.cardRadius, style: .continuous)
                    .stroke(Palette.hairline, lineWidth: 1)
            )
    }
}

// MARK: - 스탯 타일

/// 홈 화면 아래쪽에 셋이 나란히 서는 작은 수치 블록.
public struct StatTile: View {
    private let symbol: String
    private let value: String
    private let caption: String
    private let tint: Color

    public init(symbol: String, value: String, caption: String, tint: Color = Palette.brand) {
        self.symbol = symbol
        self.value = value
        self.caption = caption
        self.tint = tint
    }

    public var body: some View {
        VStack(spacing: 6) {
            Image(systemName: symbol)
                .font(.system(size: 18, weight: .semibold))
                .foregroundStyle(tint)

            Text(value)
                .font(.system(size: 20, weight: .heavy, design: .rounded))
                .foregroundStyle(Palette.ink)
                .minimumScaleFactor(0.6)
                .lineLimit(1)

            Text(caption)
                .font(.system(size: 11, weight: .medium))
                .foregroundStyle(Palette.inkSoft)
                .lineLimit(1)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 14)
        .background(Palette.canvas)
        .clipShape(RoundedRectangle(cornerRadius: Metric.tileRadius, style: .continuous))
    }
}

// MARK: - 진행률 링

/// Brainrot 의 96% 자리에 해당하는 고리. 오늘 목표 대비 학습 진행률을 보여준다.
public struct ProgressRing: View {
    private let progress: Double        // 0...1
    private let lineWidth: CGFloat

    public init(progress: Double, lineWidth: CGFloat = 14) {
        self.progress = min(max(progress, 0), 1)
        self.lineWidth = lineWidth
    }

    public var body: some View {
        ZStack {
            Circle()
                .stroke(Palette.hairline, lineWidth: lineWidth)

            Circle()
                .trim(from: 0, to: progress)
                .stroke(
                    LinearGradient(
                        colors: [Palette.brand, Palette.brandDeep],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    ),
                    style: StrokeStyle(lineWidth: lineWidth, lineCap: .round)
                )
                .rotationEffect(.degrees(-90))
                .animation(.spring(response: 0.6, dampingFraction: 0.8), value: progress)

            VStack(spacing: 0) {
                Text("\(Int(progress * 100))")
                    .font(.system(size: 40, weight: .heavy, design: .rounded))
                    .foregroundStyle(Palette.ink)
                Text("%")
                    .font(.system(size: 13, weight: .bold, design: .rounded))
                    .foregroundStyle(Palette.inkSoft)
            }
        }
    }
}

// MARK: - 스트릭 배지

/// 며칠 연속으로 목표를 채웠는지. Brainrot 우상단의 🔥 25 자리.
public struct StreakBadge: View {
    private let days: Int

    public init(days: Int) {
        self.days = days
    }

    public var body: some View {
        HStack(spacing: 4) {
            Image(systemName: "flame.fill")
                .font(.system(size: 13, weight: .bold))
            Text("\(days)")
                .font(.system(size: 15, weight: .heavy, design: .rounded))
        }
        .foregroundStyle(.white)
        .padding(.horizontal, 12)
        .padding(.vertical, 7)
        .background(
            Capsule().fill(days > 0 ? Palette.streak : Palette.inkSoft)
        )
    }
}

// MARK: - 마스코트

/// 자리를 잡아두는 임시 캐릭터. 실제 아트가 나오면
/// Image("Mascot") 로 바꾸면 된다 (Assets 에 Mascot 이름으로 추가).
public struct Mascot: View {
    private let size: CGFloat
    private let mood: Mood

    public enum Mood {
        case idle, happy, thinking
    }

    public init(size: CGFloat = 96, mood: Mood = .idle) {
        self.size = size
        self.mood = mood
    }

    public var body: some View {
        ZStack {
            Circle()
                .fill(
                    LinearGradient(
                        colors: [Palette.brand.opacity(0.22), Palette.brand.opacity(0.08)],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )

            Image(systemName: symbolName)
                .font(.system(size: size * 0.46, weight: .semibold))
                .foregroundStyle(Palette.brand)
        }
        .frame(width: size, height: size)
    }

    private var symbolName: String {
        switch mood {
        case .idle:     return "brain.head.profile"
        case .happy:    return "star.fill"
        case .thinking: return "questionmark"
        }
    }
}
