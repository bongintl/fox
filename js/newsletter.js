var $ = require('jquery');

document.querySelectorAll( '.newsletter' ).forEach( form => {
    var message = form.querySelector('.newsletter__message');
    var showMessage = msg => {
        message.innerHTML = msg;
        form.classList.add('newsletter--message');
    }
    var hideMessage = () => form.classList.remove('newsletter--message');
    form.addEventListener( 'submit', e => {
        e.preventDefault();
        showMessage('Subscribing...');
        $.post({
            url: form.getAttribute('action'),
            data: $( form ).serialize(),
            success: data => {
                showMessage( data.message );
                setTimeout( hideMessage, 2000 );
            },
            error: data => {
                showMessage( 'Error. Try again?' );
                setTimeout( hideMessage, 2000 );
            }
        })
        // fetch( form.getAttribute('action'), {
        //     method: form.getAttribute('method'),
        //     body: new FormData( form ),
        //     headers: {
        //         'X-Requested-With': 'XMLHttpRequest'
        //     }
        // })
        // .then( r => r.json() )
        // .then( r => {
        //     showMessage( r.message );
        //     setTimeout( hideMessage, 2000 );
        // })
        // .catch( e => {
        //     showMessage( 'Error. Try again?' );
        //     setTimeout( hideMessage, 2000 );
        // })
    })
})