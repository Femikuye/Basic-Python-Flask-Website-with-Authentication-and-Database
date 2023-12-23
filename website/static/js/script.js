console.log("baseUrl:", baseUrl)

$("body").on("submit", "#loginForm", function(e){
    e.preventDefault()
    let form = this.closest('form');
    form = new FormData(form);
    asyncPostQuery(form, baseUrl+"/login").then(function(response){
        showAlert(response.msg, $(".response"), 21000, "alert-success")
        window.scrollTo(0, 50)
        setTimeout(function(){
            location.href = response.redirect
        }, 1000)        
    }).catch(function(error){
        handleAjaxError(error)
    })
})
$("body").on("submit", "#registerForm", function(e){
    e.preventDefault()
    let form = this.closest('form');
    form = new FormData(form);
    asyncPostQuery(form, baseUrl+"/sign-up").then(function(response){
        showAlert(response.msg, $(".response"), 21000, "alert-success")
        window.scrollTo(0, 50)
        setTimeout(function(){
            location.href = response.redirect
        }, 4000)        
    }).catch(function(error){
        handleAjaxError(error)
    })
})
$("body").on("submit", "#addNewNote", function(e){
    e.preventDefault()
    let form = this.closest('form');
    form = new FormData(form);
    asyncPostQuery(form, baseUrl+"/").then(function(response){
        showAlert(response.msg, $(".response"), 21000, "alert-success")
        window.scrollTo(0, 50)
        $(".note-list").append(`<li class="list-group-item">${response.note}</li>`) 
    }).catch(function(error){
        handleAjaxError(error)
    })
})
$("body").on("click", ".delete-list", function(e){
    let form = new FormData()
    form.append("note-id", $(this).data("noteid"))
    asyncPostQuery(form, baseUrl+"/delete-note").then(function(response){
        window.location.reload()
    }).catch(function(error){
        handleAjaxError(error)
    })
})
const handleAjaxError = async (error) => {
    if ( error.responseJSON != undefined && error.responseJSON != 'undefined'){
        let errorMsg = error.responseJSON.msg
        if(typeof errorMsg == 'array' || typeof errorMsg == 'object'){
            let pMsg = '';
            errorMsg.forEach(function(msg){
                pMsg += `<p>${msg}</p>`
            })
            showAlert(pMsg, $(".response"), 21000, "alert-danger")
            window.scrollTo(0, 50)
            return;
        }
        showAlert(errorMsg, $(".response"), 21000, "alert-danger")
    }else{
        showAlert("<strong>An error occured</strong>", $(".response"), 21000, "alert-danger")
    }  
    window.scrollTo(0, 50)
    return;
}
const asyncPostQuery = async (formData, reqUrl) => {
    let _this = this;
    _this.data = null;
    _this.error = "";
    const queryMaker = async (form, link) => {
        return $.ajax({
            method: "POST",
            data: form,
            url: link,
            cache: false,
            contentType: false,
            processData: false,
            'success': function (res) {
               _this.data = res;
            },
            'error': function (error) {
                _this.error = error; 
            }
        })
    }
    const processQuery = async (x) => {
        return new Promise((resolve, reject) => {
            if(_this.data)
                resolve(_this.data);
            else
                reject(_this.error)
        })
    }
    return await processQuery(await queryMaker(formData, reqUrl))
}
function showAlert(message, alertElem, _duration=5000, alertType = 'alert-warning') {
    let html = ` <div class="alert ${alertType} alert-dismissible fade show" role="alert">
                        ${message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`
    alertElem.html(html)   
    setTimeout(
        function(){
          $(".my-alart").fadeOut('slow');
        } , _duration
    );
}