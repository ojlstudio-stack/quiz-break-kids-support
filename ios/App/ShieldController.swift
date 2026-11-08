import Foundation
import FamilyControls
import ManagedSettings
import DeviceActivity

/// 차단을 걸고 푸는 곳, 그리고 "얼마나 쓰면 퀴즈가 뜨는가"를 재는 곳.
/// 본체 앱과 모니터 익스텐션이 같이 쓴다.
public final class ShieldController {

    public static let shared = ShieldController()

    private let store = ManagedSettingsStore(named: QuizBreak.storeName)
    private let center = DeviceActivityCenter()

    private init() {}

    // MARK: - 켜고 끄기

    /// 부모가 기능을 켤 때. 차단은 아직 안 걸고, 사용 시간만 재기 시작한다.
    /// 아이는 평소처럼 앱을 쓰다가 간격이 차면 그때 막힌다.
    public func startWatching() {
        SharedStore.scheduleEnabled = true
        clearShieldOnly()
        armIntervalWatch()
    }

    /// 부모가 기능을 끌 때. 감시도 차단도 모두 거둔다.
    public func stopEverything() {
        SharedStore.scheduleEnabled = false
        SharedStore.unlockedUntil = nil
        store.clearAllSettings()
        center.stopMonitoring([QuizBreak.watchActivity, QuizBreak.relockActivity])
    }

    // MARK: - 차단

    /// 간격이 찼을 때. 고른 앱을 막는다. 아이가 그 앱을 열면 퀴즈 화면이 덮인다.
    public func applyShield() {
        guard let selection = SharedStore.loadSelection() else { return }

        store.shield.applications =
            selection.applicationTokens.isEmpty ? nil : selection.applicationTokens

        store.shield.applicationCategories =
            selection.categoryTokens.isEmpty ? nil : .specific(selection.categoryTokens)

        SharedStore.unlockedUntil = nil
    }

    /// 차단만 푼다. 감시는 그대로 둔다.
    private func clearShieldOnly() {
        store.shield.applications = nil
        store.shield.applicationCategories = nil
    }

    /// 퀴즈를 맞혔을 때. 잠금을 풀고 다음 간격을 다시 잰다.
    public func unlockForQuizReward() {
        clearShieldOnly()

        let minutes = SharedStore.intervalMinutes
        SharedStore.unlockedUntil = Date().addingTimeInterval(TimeInterval(minutes * 60))
        SharedStore.quizPending = false

        // 임계값은 한 번 울리면 끝이라, 다음 판을 위해 다시 건다.
        armIntervalWatch()
    }

    /// 해제 시간이 지났는데 아직 차단이 안 걸렸으면 메운다.
    /// 앱이 포그라운드로 올라올 때마다 부르면 예약이 늦어도 보완된다.
    public func reapplyIfExpired() {
        guard SharedStore.scheduleEnabled,
              SharedStore.unlockedUntil != nil,
              !SharedStore.isUnlocked
        else { return }
        applyShield()
    }

    // MARK: - 간격 재기

    /// 고른 앱의 사용 시간이 간격만큼 쌓이면 울리도록 건다.
    ///
    /// 벽시계가 아니라 **실제 사용 시간**을 센다. 아이가 유튜브를 20분 보면
    /// 그때 울리고, 앱을 안 쓰는 동안은 시간이 흐르지 않는다. 앱이 꺼져 있어도
    /// iOS 가 대신 재므로 본체 앱이 백그라운드에 살아 있을 필요가 없다.
    public func armIntervalWatch() {
        center.stopMonitoring([QuizBreak.watchActivity])

        guard SharedStore.scheduleEnabled,
              let selection = SharedStore.loadSelection()
        else { return }

        // 하루를 통째로 감시 구간으로 잡는다. 간격은 아래 이벤트가 잰다.
        let schedule = DeviceActivitySchedule(
            intervalStart: DateComponents(hour: 0, minute: 0),
            intervalEnd: DateComponents(hour: 23, minute: 59),
            repeats: true
        )

        let event = DeviceActivityEvent(
            applications: selection.applicationTokens,
            categories: selection.categoryTokens,
            webDomains: selection.webDomainTokens,
            threshold: DateComponents(minute: SharedStore.intervalMinutes)
        )

        do {
            try center.startMonitoring(
                QuizBreak.watchActivity,
                during: schedule,
                events: [QuizBreak.intervalEvent: event]
            )
        } catch {
            print("간격 감시 시작 실패: \(error)")
        }
    }
}
