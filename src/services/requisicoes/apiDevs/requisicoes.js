import apiDevs from '../../api/apiDevs'





export async function getRequest() {
    try {
        const result = await apiDevs.get('requests')
        var newList = []
        var list = result.data
        list.forEach((el) => {
            if (!el.on_the_way) {
                newList.push(el)
            }
        })

        return newList


    } catch (error) {

        return {}
    }
}


export async function getPointsCollect() {
    try {
        const result = await apiDevs.get('collection_points')
        var newList = []
        var list = result.data
        list.forEach((el) => {
            if (!el.on_the_way) {
                newList.push(el)
            }
        })

        return newList


    } catch (error) {

        return {}
    }
}


export async function postRequest(merchant_id, title, description, photo, localization, status, state, on_the_way, ideal_time, amount, price, residues, props) {
    var newDate = ideal_time + ":00:00"



    let filename = photo.split('/').pop();

    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    let formData = new FormData();




    formData.append('merchant_id', merchant_id);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('photo', { uri: photo, name: filename, type });
    formData.append('localization', localization);
    formData.append('status', status);
    formData.append('state', state);
    formData.append('on_the_way', on_the_way);
    formData.append('ideal_time', newDate);
    formData.append('amount', amount);
    formData.append('price', price);


    try {
        await apiDevs.post('requests', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(res => {
            props.navigation.navigate("MyTabsScreen")
        }).catch(err => {

        });
    } catch (error) {
        console.log(error.response);
    }

}


export async function addRequestForScarvenger(requestId, scarvengerId, props) {
    try {
        await apiDevs.post(`scavengers/addRequest/${scarvengerId}/${requestId}`).then((res) => {
            if (res.status === 200) {

                props.navigation.goBack()
                return true
            } else {
                return false
            }
        }).catch((erro) => {
            console.log(erro);
            return false
        })
    } catch (error) {

        return false
    }
}

export async function removeRequestForScarvenger(requestId, scarvengerId, props) {
    try {
        await apiDevs.post(`scavengers/removeRequest/${scarvengerId}/${requestId}`).then((res) => {
            if (res.status === 200) {
                props.navigation.goBack()
                return true

            } else {
                return false
            }
        }).catch((erro) => {
            console.log(erro);
            return false
        })
    } catch (error) {

        return false
    }
}


export async function finishRequisition(requestId, props) {
    try {
        await apiDevs.delete(`requests/${requestId}`, {
            status: true
        }).then((res) => {
            props.navigation.goBack()
            return true

        }).catch((erro) => {
            console.log(erro);
            return false
        })
    } catch (error) {

        return false
    }
}

export async function getRequestsByScarvengerId(scarvengerId) {
    try {
        const result = await apiDevs.get(`scavengers/${scarvengerId}`)
    
        return result.data.requests
        

    } catch (error) {

        return {}
    }
}


export async function getRequestsByMerchantId(merchant_id) {
    try {
        const result = await (await apiDevs.get(`merchants/${merchant_id}`))
        var listRequest = result.data.requests
        var arrayWithRequestThatHaveOnTheWayEqualsTrue = []


        for (let index = 0; index < listRequest.length; index++) {
            var isOnTheWay = listRequest[index].on_the_way
            var isStatusOk = listRequest[index].status
            if (isOnTheWay && !isStatusOk) {
                arrayWithRequestThatHaveOnTheWayEqualsTrue.push(listRequest[index])
            }
        }


        return arrayWithRequestThatHaveOnTheWayEqualsTrue
    } catch (error) {

        return {}
    }
}

export async function checkIfCurrentRequestBelongsToCurrentScarvenger(scarvengerId) {
    try {
        //recuperamos todas as requisicoes do catador
        const result = await (await apiDevs.get(`scavengers/${scarvengerId}`))
        var requests = result.data.requests
        //retornando a lista
        return requests



    } catch (error) {

        return {}
    }
}




