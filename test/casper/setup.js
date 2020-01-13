module.exports = {
  get_base_url: function(casper){
    const stage = casper.cli.get('stage')
    if ( stage == 'dev' || stage == 'staging') {
      const url = 'https://' + stage + 'app.tesselo.com/'
    } else if (stage == 'localhost') {
      const url = 'http://localhost:8080/'
    } else {
      const url = 'https://app.tesselo.com/'
    }
    casper.echo('Using ' + url)
    return url
  },
  get_creds: function(casper) {
    const usr = casper.cli.get('username');
    const pw = casper.cli.get('password')
    return {
      username: usr,
      password: pw
    }
  }
}
