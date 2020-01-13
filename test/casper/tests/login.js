const setup = require('../setup')

// Get authentication credentials from command line args.
const creds = setup.get_creds(casper);
const has_creds = creds.username && creds.password;

casper.test.begin('Tesselo login form works (currently mainly disabled)', 1, function suite(test) {

    casper.start(setup.get_base_url(casper) + "login", function() {

      casper.then(function() {
        casper.fill('form', {
          'username': creds.username,
          'password': creds.password
        }, false);

        // console.log('username', this.evaluate(function() {
        //   return document.querySelector('input[name="username"]').value
        // }));
        // console.log('password', this.evaluate(function() {
        //   return document.querySelector('input[name="password"]').value
        // }));

        casper.click('.login-button');
        casper.sendKeys('.login-button', casper.page.event.key.Enter, {keepFocus: true});
      });

      casper.wait(500);

      casper.then(function() {
        // console.log(casper.evaluate(function(){
        //   return document.body.innerHTML;
        // }));
        // This title is not the one after the login. The form submission fails
        // in this casperjs framework (bug).
        test.assertTitle("Tesselo | Tesselo", "Tesselo title is the one expected.");
      });
    });

    casper.run(function() {
        test.done();
    });
});
