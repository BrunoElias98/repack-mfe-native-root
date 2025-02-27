describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('First Test', async () => {
    element(by.id('parcel-root-callback'));
    element(by.id('parcel-root-store'));

    element(by.id('storage-message'));
    element(by.id('cart-app-container'));
  });
});
