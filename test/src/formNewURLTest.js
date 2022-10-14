xdescribe('form test with a new URL', function() {
  before(async () => {
    await browser
      .navigateTo(`${process.env.BASE_VITE_URL}/nightwatch?component=/test/components/Form.vue`);
  });

  it('should render a form component without error', async function() {
    const component = await browser.findElement('form');

    await browser.expect(component).to.be.visible;
  });
});