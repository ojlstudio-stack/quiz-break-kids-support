import Foundation
import FamilyControls
import ManagedSettings
import DeviceActivity

/// 차단을 걸고 푸는 곳. 본체 앱과 모니터 익스텐션이 같이 쓴다.
public final class ShieldController {

    public static let shared = ShieldController()

    private let store = ManagedSettingsStore(named: QuizBreak.storeName)
    private let center = DeviceActivityCenter()

    private init() {}

    /// 부모가 고른 앱에 차단을 건다.
    public func applyShield() {
        guard let selection = SharedStore.loadSelection() else {
            clearShield()
            return
        }

        store.shield.applications =
            selection.applicationTokens.isEmpty ? nil : selection.applicationTokens

        store.shield.applicationCategories =
            selection.categoryTokens.isEmpty ? nil : .specific(selection.categoryTokens)

        SharedStore.unlockedUntil = nil
    }

    /// 차단을 전부 푼다. 부모가 기능을 끌 때만 쓴다.
    public func clearShield() {
        store.clearAllSettings()
        center.stopMonitoring([QuizBreak.relockActivity])
        SharedStore.unlockedUntil = nil
    }

    /// 퀴즈를 맞혔을 때. 정해진 시간만큼 열어주고, 끝나면 다시 잠그도록 예약한다.
    ///
    /// DeviceActivity 는 15분보다 짧은 구간을 받지 않으므로 그 아래로는 올려 잡는다.
    /// 그보다 짧게 열어주고 싶다면 예약에 기대지 말고 본체 앱이 포그라운드로
    /// 돌아올 때마다 `reapplyIfExpired()` 를 불러서 직접 거둬들여야 한다.
    public func unlockForQuizReward() {
        let minutes = max(SharedStore.unlockMinutes, QuizBreak.minimumWindowMinutes)

        store.shield.applications = nil
        store.shield.applicationCategories = nil

        let until = Date().addingTimeInterval(TimeInterval(minutes * 60))
        SharedStore.unlockedUntil = until
        SharedStore.quizPending = false

        scheduleRelock(at: until)
    }

    /// 해제 시간이 지났는데 아직 차단이 안 걸렸으면 다시 건다.
    /// 앱이 포그라운드로 올라올 때마다 부르면 예약이 늦어도 메워진다.
    public func reapplyIfExpired() {
        guard SharedStore.unlockedUntil != nil, !SharedStore.isUnlocked else { return }
        applyShield()
    }

    // MARK: -

    /// 해제가 끝나는 시각에 깨어나도록 모니터링을 건다.
    /// intervalDidEnd 에서 다시 차단이 걸린다.
    private func scheduleRelock(at date: Date) {
        center.stopMonitoring([QuizBreak.relockActivity])

        let calendar = Calendar.current
        let fields: Set<Calendar.Component> = [.hour, .minute, .second]

        let schedule = DeviceActivitySchedule(
            intervalStart: calendar.dateComponents(fields, from: Date().addingTimeInterval(1)),
            intervalEnd: calendar.dateComponents(fields, from: date),
            repeats: false
        )

        do {
            try center.startMonitoring(QuizBreak.relockActivity, during: schedule)
        } catch {
            // 예약이 실패해도 차단이 영영 안 걸리는 일은 없어야 한다.
            // 다음에 앱이 켜질 때 reapplyIfExpired() 가 메운다.
            print("재잠금 예약 실패: \(error)")
        }
    }
}
