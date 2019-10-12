//Function payload for login

function payload(id) {
    var date = new Date()
    var currTime = date.getTime()
    var payload = {
        'iat': currTime
        , 'exp': currTime + 36000
        , 'context': {
            'user': {
                'id': id
            }
        }
    }

    return payload
}

module.exports = payload
