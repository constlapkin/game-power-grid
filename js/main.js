const stages = [1, 2, 3];
const types = new Map([
    [1, 'Покупка городов'],
    [2, 'Аукцион электростанций'],
    [3, 'Покупка ресурсов'],
    [4, 'Получение прибыли']
]);
var cities = ['Karamay', 'Wulumudi', 'Ku\'erle', 'Hami'];

function mapToObj(map){
    const obj = {}
    for (let [k,v] of map)
        obj[k] = v
    return obj
}

if(localStorage.getItem('current_stage') === null) {
    let result_count_users = prompt('Введите количество игроков', '');

    localStorage.setItem('count_users', result_count_users);
    localStorage.setItem('current_stage', 1);
    localStorage.setItem('current_type', 1);
    localStorage.setItem('current_user', 1);
    localStorage.setItem('round', 1);
    localStorage.setItem('cities', cities);

    var users = [];
    for(let i = 1; i <= localStorage.getItem('count_users'); i++) {
        users.push(i);
    }
    localStorage.setItem('users', users);

    var user_cities = new Map();
    for (let i = 0; i <= users.length; i++) {
        user_cities.set(i + 1, [])
    }
    var myJson = {};
    myJson.user_cities = mapToObj(user_cities);
    var json = JSON.stringify(myJson);

    localStorage.setItem('user_cities', json);
}
var users = [];
for(let i = 1; i <= localStorage.getItem('count_users'); i++) {
    users.push(i);
}


function changeShowVars(){
    $('#stage').html(localStorage.getItem('current_stage'));
    $('#type').html(types.get(parseInt(localStorage.getItem('current_type'))));
    $('#user').html(localStorage.getItem('current_user'));
}

function showUserCities() {
    $('#user-cities').show();

    let jsoncitiestmp = JSON.parse(localStorage.getItem('user_cities'))['user_cities'][localStorage.getItem('current_user')];

    // let tmp_user_cities = user_cities.get(current_user);
    let tmp_user_cities = jsoncitiestmp;
    let cities = '';
    for(let i = 0; i < tmp_user_cities.length; i++){
        cities = cities + '<li>' + tmp_user_cities[i] + '</li>';
    }
    $('#user-cities').html('<p>Купленные города - (' + tmp_user_cities.length + '):</p><ol>' + cities + '</ol>');
}

function hideUserCities() {
    $('#user-cities').hide();
    $('#user-cities').html();
}

function showCities (){
    $('#cities').show();
    let options = '';
    for (let i = 0; i < cities.length; i++) {
        options = options + '<option id="city-' + i + '" value="' + i + '">' + cities[i] + '</option>';
    }
    $('#cities').html('<select id="choose-city">' + options + '</select> <button type="button" class="btn btn-success" id="buy-city">Купить город</button>');
}

function hideCities (){
    $('#cities').hide();
    $('#cities').html('');
}

function buyingCities(){
    showCities();
    showUserCities();
    $('#buy-city').click(function (){
        let city_id = $('#choose-city').val();
        let jsoncitiestmp = JSON.parse(localStorage.getItem('user_cities'))['user_cities'][localStorage.getItem('current_user')];

        // let tmp_user_cities = user_cities.get(current_user);
        let tmp_user_cities = jsoncitiestmp;
        tmp_user_cities.push(cities[city_id]);
        let jsontmp = JSON.parse(localStorage.getItem('user_cities'));
        jsontmp['user_cities'][localStorage.getItem('current_user')] = tmp_user_cities;
        localStorage.setItem('user_cities', JSON.stringify(jsontmp));

        showUserCities();
        /* удаление после реализации городов по этапам */
        //cities.splice(city_id, 1);

    });
}


$( document ).ready(function (){
    $('#next').click(function () {
        if (parseInt(localStorage.getItem('current_user')) + 1 <= users.length) {
            let tmp_user = parseInt(localStorage.getItem('current_user')) + 1;
            localStorage.setItem('current_user', tmp_user);
        } else {
            let tmp_user = 1;
            localStorage.setItem('current_user', tmp_user);
            if (parseInt(localStorage.getItem('current_type')) + 1 <= types.size) {
                let tmp_type = parseInt(localStorage.getItem('current_type')) + 1;
                localStorage.setItem('current_type', tmp_type);
            } else {
                localStorage.setItem('current_type', 1);
                let tmp_round = parseInt(localStorage.getItem('round')) + 1;
                localStorage.setItem('round', tmp_round);
            }
        }
        changeShowVars();

        /* Buying cities */
        if(localStorage.getItem('current_type') == 1) {
            buyingCities();
        }
        else if (localStorage.getItem('current_type') == 2) {
            hideCities();
            hideUserCities();
        }
    });
});
