import Foundation
import FamilyControls
import ManagedSettings
import DeviceActivity

/// 본체 앱과 세 개의 익스텐션이 공유하는 상수와 저장소.
/// 이 파일은 네 타깃 모두의 Target Membership 에 체크되어야 한다.
public enum QuizBreak {

    /// Signing & Capabilities 에서 만든 App Group ID 로 바꿀 것.
    public static let appGroupID = "group.com.ojlstudio.quizbreakkids"

    /// 차단 설정을 담는 저장소 이름. 앱 전체에서 하나만 쓴다.
    public static let storeName = ManagedSettingsStore.Name("quizBreakShield")

    /// 해제 시간이 끝났을 때 다시 차단하려고 거는 모니터링 이름.
    public static let relockActivity = DeviceActivityName("quizBreakRelock")

    /// 차단 화면에서 퀴즈 앱으로 들어올 때 쓰는 딥링크.
    /// Info.plist 의 URL Types 에 quizbreak 스킴을 등록해야 한다.
    public static let quizDeepLink = URL(string: "quizbreak://quiz")!

    /// DeviceActivity 가 받아주는 최소 모니터링 길이(분).
    /// 이보다 짧은 스케줄은 startMonitoring 에서 거부된다.
    public static let minimumWindowMinutes = 15
}

/// App Group 을 통해 프로세스 사이로 값을 넘기는 창구.
/// 익스텐션은 본체 앱과 다른 프로세스라 UserDefaults.standard 를 공유하지 않는다.
public enum SharedStore {

    private static let defaults = UserDefaults(suiteName: QuizBreak.appGroupID)!

    private enum Key {
        static let selection = "blockedSelection"
        static let unlockMinutes = "unlockMinutes"
        static let unlockedUntil = "unlockedUntil"
        static let quizPending = "quizPending"
        static let parentPIN = "parentPIN"
    }

    // MARK: 부모가 고른 차단 대상

    public static func saveSelection(_ selection: FamilyActivitySelection) {
        guard let data = try? JSONEncoder().encode(selection) else { return }
        defaults.set(data, forKey: Key.selection)
    }

    public static func loadSelection() -> FamilyActivitySelection? {
        guard let data = defaults.data(forKey: Key.selection) else { return nil }
        return try? JSONDecoder().decode(FamilyActivitySelection.self, from: data)
    }

    // MARK: 퀴즈를 맞히면 열어주는 시간

    public static var unlockMinutes: Int {
        get {
            let stored = defaults.integer(forKey: Key.unlockMinutes)
            return stored == 0 ? QuizBreak.minimumWindowMinutes : stored
        }
        set { defaults.set(newValue, forKey: Key.unlockMinutes) }
    }

    /// 이 시각까지는 차단이 풀려 있다. nil 이면 차단 중.
    public static var unlockedUntil: Date? {
        get { defaults.object(forKey: Key.unlockedUntil) as? Date }
        set { defaults.set(newValue, forKey: Key.unlockedUntil) }
    }

    public static var isUnlocked: Bool {
        guard let until = unlockedUntil else { return false }
        return until > Date()
    }

    // MARK: 차단 화면에서 퀴즈 버튼을 눌렀는지

    /// ShieldAction 익스텐션이 켜고, 퀴즈 화면이 뜨면 끈다.
    public static var quizPending: Bool {
        get { defaults.bool(forKey: Key.quizPending) }
        set { defaults.set(newValue, forKey: Key.quizPending) }
    }

    // MARK: 부모 PIN

    public static var parentPIN: String? {
        get { defaults.string(forKey: Key.parentPIN) }
        set { defaults.set(newValue, forKey: Key.parentPIN) }
    }
}
