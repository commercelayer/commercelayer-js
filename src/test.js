const clsdk = require('@commercelayer/sdk')
const util = require('util')



function log(output) {
        console.log(util.inspect(output, false, null, true))
}

let config = {
    client_id : '351020e9c84f2076755083f08bfe8e47365a76395db1059c3219c37abff86534',
        market_id : '185',
        base_url : "https://static-commerce.commercelayer.io",
        country_code : 'US',
        language_code : 'en',
}


clsdk.initialize(config);


// let qf = clsdk.query.newInstance().filter('token', '42757e0131ec48a110b2f7c0850762a7').include('line_items');

// clsdk.listOrders(qf)
//         .then(response => console.log(response))
//         .catch(error => console.log(error))

let skuCodes = ['TSHIRTMM000000E63E74MXXX', 'TSHIRTMM000000E63E74LXXX', 'TSHIRTMM000000E63E74XLXX',  'TSHIRTMM000000FFFFFFMXXX']

let qf = new clsdk.query.QueryFilter()
        .filter('codes', skuCodes.join(','))
        .include('prices')
        .page(null, 25);

      let skuAttributes = [
        'id',
        'code',
        'prices.formatted_amount',
        'prices.formatted_compare_at_amount',
        'prices.amount_cents',
        'prices.compare_at_amount_cents'
      ]
// clsdk.settings.raw_response = false;
//       clsdk.listSkus(qf.build())
//         .then(data => {
//          console.log(data.get(skuAttributes))
//         })



clsdk.settings.raw_response = false;
qf = new clsdk.query.QueryFilter();

    qf.include('line_items').filter('token', '42757e0131ec48a110b2f7c0850762a7')


    clsdk.listOrders(qf).then(res => {
            let li = res.get(['id']);
        //     let li = res;
        //     console.log(li.data[0].relationships)
        log(li)
    })