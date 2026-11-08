import DeviceActivity

/// iOS 가 깨워주는 곳. 본체 앱이 꺼져 있어도 여기는 돈다.
/// 타깃: Device Activity Monitor Extension
final class DeviceActivityMonitorExtension: DeviceActivityMonitor {

    /// 고른 앱의 사용 시간이 간격만큼 쌓였다. 지금 막는다.
    /// 아이가 유튜브를 보던 중이라면 다음 순간 차단 화면이 덮인다.
    override func eventDidReachThreshold(
        _ event: DeviceActivityEvent.Name,
        activity: DeviceActivityName
    ) {
        super.eventDidReachThreshold(event, activity: activity)

        guard event == QuizBreak.intervalEvent else { return }

        SharedStore.quizPending = true
        ShieldController.shared.applyShield()
    }

    /// 날이 바뀌어 감시 구간이 새로 시작됐다. 임계값을 다시 건다.
    override func intervalDidStart(for activity: DeviceActivityName) {
        super.intervalDidStart(for: activity)

        guard activity == QuizBreak.watchActivity else { return }
        // 하루치 구간이 새로 열렸을 뿐, 차단 상태는 건드리지 않는다.
    }

    override func intervalDidEnd(for activity: DeviceActivityName) {
        super.intervalDidEnd(for: activity)

        // 보상 시간이 끝났다면 다시 잠근다.
        if activity == QuizBreak.relockActivity {
            ShieldController.shared.applyShield()
        }
    }
}
