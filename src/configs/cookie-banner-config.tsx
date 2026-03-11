export const cookieBanner = {
  key: 'user-cookie-settings',
  allowSettingsCustomization: true,
  isInitiallyExpanded: false,
  description: (
    <>
      <p>
        These cookies are necessary for the website to function and cannot be switched off in our
        systems. They are usually only set in response to actions made by you which amount to a
        request for services, such as setting your privacy preferences, logging in, or filling in
        forms.
      </p>
      <p>
        These cookies are necessary for the website to function and cannot be switched off in our
        systems.
      </p>
    </>
  ),
  cookieSettings: [
    {
      value: 'marketing',
      title: 'Accept terms and conditions',
      description: (
        <>
          These cookies are necessary for the website to function and cannot be switched off in our
          systems. They are usually only set in response to actions made by you which amount to a
          request for services, such as setting your privacy preferences, logging in, or filling in
          forms.
        </>
      ),
      isChecked: false,
      isRequired: false,
    },
    {
      value: 'analytics',
      title: 'Analytics',
      description: (
        <>
          Analytics cookies and services are used for collecting statistical information about how
          visitors interact with a website. These technologies provide insights into website usage,
          visitor behavior, and site performance to understand and improve the site and enhance user
          experience.
        </>
      ),
      isChecked: false,
      isRequired: false,
    },
    {
      value: 'essential',
      title: 'Essential',
      description: (
        <>
          Essential cookies and services are used to enable core website features, such as ensuring
          the security of the website.
        </>
      ),
      isChecked: true,
      isRequired: true,
    },
  ],
};
