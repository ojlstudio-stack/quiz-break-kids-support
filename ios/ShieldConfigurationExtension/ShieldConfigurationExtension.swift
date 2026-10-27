import ManagedSettings
import ManagedSettingsUI
import UIKit

/// 차단된 앱을 열었을 때 덮이는 화면의 생김새.
/// 타깃: Shield Configuration Extension
final class ShieldConfigurationExtension: ShieldConfigurationDataSource {

    override func configuration(shielding application: Application) -> ShieldConfiguration {
        quizShield(appName: application.localizedDisplayName)
    }

    override func configuration(
        shielding application: Application,
        in category: ActivityCategory
    ) -> ShieldConfiguration {
        quizShield(appName: application.localizedDisplayName)
    }

    override func configuration(shielding webDomain: WebDomain) -> ShieldConfiguration {
        quizShield(appName: webDomain.domain)
    }

    override func configuration(
        shielding webDomain: WebDomain,
        in category: ActivityCategory
    ) -> ShieldConfiguration {
        quizShield(appName: webDomain.domain)
    }

    // MARK: -

    private func quizShield(appName: String?) -> ShieldConfiguration {
        let subtitle = appName.map { "\($0)을(를) 열려면 퀴즈를 맞혀야 해요" }
            ?? "열려면 퀴즈를 맞혀야 해요"

        return ShieldConfiguration(
            backgroundBlurStyle: .systemMaterialDark,
            backgroundColor: UIColor(red: 0.486, green: 0.361, blue: 1.0, alpha: 1.0),
            icon: UIImage(named: "ShieldIcon"),
            title: .init(text: "퀴즈 시간이에요!", color: .white),
            subtitle: .init(text: subtitle, color: UIColor.white.withAlphaComponent(0.85)),
            primaryButtonLabel: .init(text: "퀴즈 풀기", color: UIColor(red: 0.486, green: 0.361, blue: 1.0, alpha: 1.0)),
            primaryButtonBackgroundColor: .white,
            secondaryButtonLabel: .init(text: "나중에", color: UIColor.white.withAlphaComponent(0.85))
        )
    }
}
