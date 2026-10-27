import ManagedSettings
import UserNotifications

/// 차단 화면의 버튼을 눌렀을 때 들어온다.
/// 타깃: Shield Action Extension
///
/// 익스텐션에서 본체 앱을 직접 여는 API 는 없다. 응답은 close / defer / none 뿐이다.
/// 그래서 퀴즈 앱으로 보내려면 알림을 띄우고 아이가 그걸 탭하게 한다.
final class ShieldActionExtension: ShieldActionDelegate {

    override func handle(
        action: ShieldAction,
        for application: ApplicationToken,
        completionHandler: @escaping (ShieldActionResponse) -> Void
    ) {
        respond(to: action, completionHandler: completionHandler)
    }

    override func handle(
        action: ShieldAction,
        for category: ActivityCategoryToken,
        completionHandler: @escaping (ShieldActionResponse) -> Void
    ) {
        respond(to: action, completionHandler: completionHandler)
    }

    override func handle(
        action: ShieldAction,
        for webDomain: WebDomainToken,
        completionHandler: @escaping (ShieldActionResponse) -> Void
    ) {
        respond(to: action, completionHandler: completionHandler)
    }

    // MARK: -

    private func respond(
        to action: ShieldAction,
        completionHandler: @escaping (ShieldActionResponse) -> Void
    ) {
        switch action {
        case .primaryButtonPressed:
            SharedStore.quizPending = true
            postQuizNotification { completionHandler(.defer) }

        case .secondaryButtonPressed:
            completionHandler(.close)

        @unknown default:
            completionHandler(.close)
        }
    }

    /// 퀴즈 앱으로 들어오라는 알림. 탭하면 딥링크로 퀴즈 화면이 열린다.
    private func postQuizNotification(completion: @escaping () -> Void) {
        let content = UNMutableNotificationContent()
        content.title = "퀴즈 시간이에요!"
        content.body = "문제를 맞히면 앱이 다시 열려요"
        content.sound = .default
        content.userInfo = ["deepLink": QuizBreak.quizDeepLink.absoluteString]

        let request = UNNotificationRequest(
            identifier: "quizbreak.gate",
            content: content,
            trigger: nil      // 바로 띄운다
        )

        UNUserNotificationCenter.current().add(request) { _ in
            completion()
        }
    }
}
