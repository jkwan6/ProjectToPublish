using OrchardCore.Data.Migration;
using OrchardCore.Entities;
using OrchardCore.Environment.Shell;
using OrchardCore.Settings;
using OrchardCore.Users.Models;

namespace RegistrationModule.Migration
{
    public class LoginMigration : DataMigration
    {
        private readonly IShellFeaturesManager _shellFeaturesManager;
        private readonly ISiteService _siteService;
        public LoginMigration(IShellFeaturesManager shellFeaturesManager, ISiteService siteService)
        {
            _shellFeaturesManager = shellFeaturesManager;
            _siteService = siteService;
        }

        public int Create()
        {
            // Turn on Users Registration Feature
            var features = _shellFeaturesManager.GetAvailableFeaturesAsync().Result;
            var usersRegistrationFeature = features.FirstOrDefault(x => x.Name == "Users Registration");
            _shellFeaturesManager.EnableFeaturesAsync(new[] { usersRegistrationFeature }, force: true);

            // Allow Registration from Registration Settings
            var siteSettings = _siteService.GetSiteSettingsAsync().Result;
            siteSettings.Alter<RegistrationSettings>(
                nameof(RegistrationSettings),
                x => x.UsersCanRegister = UserRegistrationType.AllowRegistration);
            _siteService.UpdateSiteSettingsAsync(siteSettings);

            return 1;
        }
    }
}