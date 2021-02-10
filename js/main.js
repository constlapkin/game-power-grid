const stages = [1, 2, 3];
const types = new Map([
    [1, 'Аукцион электростанций'],
    [2, 'Покупка ресурсов'],
    [3, 'Строительство'],
    [4, 'Бюрократия']
]);

var cities = ['Karamay', 'Wulumudi', 'Ku\'erle', 'Hami'];
var users = [];
for(let i = 1; i <= localStorage.getItem('count_users'); i++) {
    users.push(i);
}




function changeShowVars(){
    $('#stage').html(localStorage.getItem('current_stage'));
    $('#type').html(types.get(parseInt(localStorage.getItem('current_type'))));
    $('#user').html(localStorage.getItem('current_user'));
    $('#round').html(localStorage.getItem('round'));

    let money = localStorage.getItem('money').split(',')[localStorage.getItem('current_user') - 1];
    $('#money').html(money);
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

function showCities () {
    $('#cities').show();
    let options = '';

    let jsoncitiestmp = JSON.parse(localStorage.getItem('user_cities'))['user_cities'][localStorage.getItem('current_user')];

    // let tmp_user_cities = user_cities.get(current_user);
    let tmp_user_cities = jsoncitiestmp;

    let cities_user = arr_diff(localStorage.getItem('cities').split(','), tmp_user_cities);
    console.log(localStorage.getItem('cities').split(','));
    console.log(tmp_user_cities);
    console.log(cities_user);
    for (let i = 0; i < cities_user.length; i++) {
        options = options + '<option id="city-' + i + '" value="' + i + '">' + cities[i] + '</option>';
    }

    let tmp_select = '<select id="choose-city">' + options + '</select>';
    let tmp_button = '<div><button type="button" class="btn btn-success buy-city" value="10">Купить 10</button></div>';
    if(localStorage.getItem('current_stage') >= 2) {
        tmp_button = tmp_button +  '<div><button type="button" class="btn btn-warning buy-city" value="15">Купить 15</button></div>';
        if(localStorage.getItem('current_stage') == 3) {
            tmp_button = tmp_button + '<div><button type="button" class="btn btn-danger buy-city" value="20">Купить 20</button></div>';
        }
    }

    $('#cities').html(tmp_select + tmp_button);
}

function hideCities (){
    $('#cities').hide();
    $('#cities').html('');
}

function buyingCities(){
    showCities();
    showUserCities();
    $('.buy-city').click(function (){
        //$(this).val()
        let money = localStorage.getItem('money').split(',');

        if(parseInt(money[localStorage.getItem('current_user') - 1]) >= $(this).val()) {
            money[localStorage.getItem('current_user') - 1] = money[localStorage.getItem('current_user') - 1] - $(this).val();
            $('#money').html(money[localStorage.getItem('current_user') - 1]);
            localStorage.setItem('money', money);
            let city_id = $('#choose-city').val();
            let jsoncitiestmp = JSON.parse(localStorage.getItem('user_cities'))['user_cities'][localStorage.getItem('current_user')];
            let tmp_user_cities = jsoncitiestmp;
            tmp_user_cities.push(cities[city_id]);
            let jsontmp = JSON.parse(localStorage.getItem('user_cities'));
            jsontmp['user_cities'][localStorage.getItem('current_user')] = tmp_user_cities;
            localStorage.setItem('user_cities', JSON.stringify(jsontmp));

            showUserCities();
            /* удаление после реализации городов по этапам */
            //cities.splice(city_id, 1);

        }
        else {
            alert('деняк нет, но вы держитесь');
        }
    });
}


function initVars() {


    if(localStorage.getItem('current_stage') === null) {
        let result_count_users = prompt('Введите количество игроков', '');

        localStorage.setItem('count_users', result_count_users);
        localStorage.setItem('current_stage', 1);
        localStorage.setItem('current_type', 1);
        localStorage.setItem('current_user', 1);
        localStorage.setItem('round', 1);
        localStorage.setItem('cities', cities);
        localStorage.setItem('types', ['Аукцион электростанций', 'Покупка ресурсов', 'Строительство', 'Бюрократия']);


        localStorage.setItem('users', users);

        var money = [];
        for(let i = 1; i <= localStorage.getItem('count_users'); i++) {
            money.push(50);
        }
        localStorage.setItem('money', money);



        var user_cities = new Map();
        for (let i = 0; i <= users.length; i++) {
            user_cities.set(i + 1, [])
        }
        var myJson = {};
        myJson.user_cities = mapToObj(user_cities);
        var json = JSON.stringify(myJson);

        localStorage.setItem('user_cities', json);


        let time = new Date();
        time = time.getHours() + ':' + time.getMinutes();
        localStorage.setItem('time', time);
    }
    var users = [];
    for(let i = 1; i <= localStorage.getItem('count_users'); i++) {
        users.push(i);
    }
}



$( document ).ready(function (){
    initVars();


    $('#time').html(localStorage.getItem('time'));
    changeShowVars();
    /* Buying cities */
    if(localStorage.getItem('current_type') == 3) {
        buyingCities();
    }
    else if (localStorage.getItem('current_type') == 4) {
        hideCities();
        hideUserCities();
    }


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
        if(localStorage.getItem('current_type') == 3) {
            buyingCities();
        }
        else if (localStorage.getItem('current_type') == 4) {
            hideCities();
            hideUserCities();
        }
    });
});
