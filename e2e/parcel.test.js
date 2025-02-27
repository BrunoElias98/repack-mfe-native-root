describe('Parcel in Root Integration Tests', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should increment the counter in parcel and reflect in root', async () => {
    await element(by.id('increment-button')).tap();
    await element(by.id('get-cart-count')).tap();

    await expect(element(by.id('parcel-root-store'))).toHaveText(
      'Valor do contador da parcel na Root via store: 1',
    );
  });

  it('should save message in storage and reflect in root', async () => {
    await element(by.text('Salvar no Storage')).tap();

    await expect(element(by.id('storage-message'))).toHaveText(
      'Mensagem do Storage: Valor salvo pela Cart2 (parcel)!',
    );
  });

  it('should remove message from storage and reflect in root', async () => {
    await element(by.text('Limpar Storage')).tap();

    await expect(element(by.id('storage-message'))).toHaveText(
      'Mensagem do Storage: Nenhuma mensagem',
    );
  });
});
