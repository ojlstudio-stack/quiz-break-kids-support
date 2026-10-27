import Foundation
import FamilyControls

/// Screen Time 권한 상태를 들고 있는 객체.
/// 권한이 .approved 가 되기 전에는 FamilyActivityPicker 도 ManagedSettings 도 동작하지 않는다.
@MainActor
public final class AuthorizationManager: ObservableObject {

    @Published public private(set) var status: AuthorizationStatus
    @Published public private(set) var lastError: String?

    public init() {
        status = AuthorizationCenter.shared.authorizationStatus
    }

    public var isApproved: Bool { status == .approved }

    /// 보호자에게 권한을 요청한다.
    /// `.child` 로 요청하면 기기 소유자의 Screen Time 암호를 묻는 화면이 뜬다.
    public func requestAuthorization() async {
        do {
            try await AuthorizationCenter.shared.requestAuthorization(for: .child)
            status = AuthorizationCenter.shared.authorizationStatus
            lastError = nil
        } catch {
            status = AuthorizationCenter.shared.authorizationStatus
            lastError = Self.message(for: error)
        }
    }

    /// 권한을 되돌린다. 걸려 있던 차단도 같이 풀어야 한다.
    public func revoke() {
        AuthorizationCenter.shared.revokeAuthorization { [weak self] result in
            Task { @MainActor in
                guard let self else { return }
                if case .failure(let error) = result {
                    self.lastError = Self.message(for: error)
                }
                self.status = AuthorizationCenter.shared.authorizationStatus
            }
        }
    }

    private static func message(for error: Error) -> String {
        guard let familyError = error as? FamilyControlsError else {
            return error.localizedDescription
        }
        switch familyError {
        case .unavailable:
            return "이 기기에서는 스크린타임 기능을 쓸 수 없습니다."
        case .invalidAccountType:
            return "가족 공유에 연결된 Apple 계정이 필요합니다."
        case .authorizationCanceled:
            return "권한 요청이 취소되었습니다."
        case .authorizationConflict:
            return "다른 스크린타임 앱이 이미 이 기기를 관리하고 있습니다."
        case .networkError:
            return "네트워크 연결을 확인해 주세요."
        case .restricted:
            return "기기 정책 때문에 이 기능이 제한되어 있습니다."
        @unknown default:
            return error.localizedDescription
        }
    }
}
