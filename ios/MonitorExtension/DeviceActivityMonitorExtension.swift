import DeviceActivity

/// 해제 시간이 끝나면 iOS 가 이 익스텐션을 깨운다.
/// 타깃: Device Activity Monitor Extension
final class DeviceActivityMonitorExtension: DeviceActivityMonitor {

    override func intervalDidEnd(for activity: DeviceActivityName) {
        super.intervalDidEnd(for: activity)

        guard activity == QuizBreak.relockActivity else { return }

        // 보상 시간이 끝났다. 다시 잠근다.
        ShieldController.shared.applyShield()
    }

    override func intervalDidStart(for activity: DeviceActivityName) {
        super.intervalDidStart(for: activity)
        // 해제 구간의 시작. 차단은 unlockForQuizReward() 에서 이미 풀려 있다.
    }
}
