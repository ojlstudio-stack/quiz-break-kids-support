import SwiftUI

/// 앱의 바깥 껍데기. 하단 탭 넷으로 나눈다.
public struct RootTabView: View {

    @Environment(\.scenePhase) private var scenePhase
    @State private var showUnlockQuiz = false

    public init() {}

    public var body: some View {
        TabView {
            HomeView()
                .tabItem { Label("홈", systemImage: "house.fill") }

            StatsView()
                .tabItem { Label("통계", systemImage: "chart.bar.fill") }

            ParentSettingsView()
                .tabItem { Label("잠금", systemImage: "lock.fill") }
        }
        .tint(Palette.brand)
        .onOpenURL { url in
            // 차단 화면에서 띄운 알림을 탭하고 들어온 경우.
            guard url == QuizBreak.quizDeepLink else { return }
            startUnlockQuiz()
        }
        .onChange(of: scenePhase) { _, phase in
            guard phase == .active else { return }

            // 보상 시간이 지났는데 예약이 늦었으면 여기서 거둬들인다.
            ShieldController.shared.reapplyIfExpired()

            // 차단 화면에서 버튼만 누르고 알림을 안 탭했을 수도 있다.
            if SharedStore.quizPending { startUnlockQuiz() }
        }
        .fullScreenCover(isPresented: $showUnlockQuiz) {
            QuizGameView()
        }
    }

    private func startUnlockQuiz() {
        SharedStore.quizPending = false
        QuizEngine.shared.start(questions: QuestionBank.shared.draw(count: 3))
        showUnlockQuiz = true
    }
}
