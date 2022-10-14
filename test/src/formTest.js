xdescribe('form test', function() {
  let component;

  before(async () => {
    component = await browser.mountComponent('/test/components/Form.vue');
  });

  it('should render a form component without error', async function() {
    await browser.expect(component).to.be.visible;
  });
});