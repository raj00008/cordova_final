const app = {
    URL: '../www/cars/cars.json',
    DATA: null,
    init: function () {
        //fetch the data
        app.getData();
        //add event listeners 
        app.addListeners();
        //fix the current url
        history.replaceState({}, "List", "#list");
        document.title = 'List of Items';
    },
    addListeners: function () {
        //back button on second page
        let backBtn = document.querySelector('#details-page header a');
        backBtn.addEventListener('click', app.backHome);
        //listen for the browser back button
        window.addEventListener('popstate', app.browserBack);
    },
    getData: function () {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', app.URL);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                console.log(xhr.status, xhr.statusText);
                let data = JSON.parse(xhr.responseText);
                console.log(data.cars);
                app.showThings(data.cars);
                app.DATA=data.cars;
            }
        }
        xhr.send(null);
        //fetch the JSON data
        //fetch()
        //.then()
        //.then(
        //save the imported JSON into app.DATA
        //pass the data to a function that builds the first page  
        
        //).catch();
    },
    showThings: function (cars) {
        //loop through the array and display the cards
        //add the click listener on each title
        console.log(cars);
              let section = document.querySelector('#list-page .content');
        let df = document.createDocumentFragment();
        section.innerHTML= "";
    
        cars.forEach((car)=>{
         let div =document.createElement('div');
            div.classList.add('item-card');
            let img = document.createElement('img');
            img.setAttribute('src',car.img);
            img.setAttribute('alt','logo');
            img.classList.add('icon');
            div.appendChild(img);
            
            let h2 =document.createElement('h2');
            h2.setAttribute('data-key',car.id);
            h2.classList.add('item-title');
            h2.textContent=car.companyName;
            div.appendChild(h2);
            h2.addEventListener('click',app.navDetails)
            
            let p =document.createElement('p');
            p.classList.add('item-desc');
            p.textContent=car.slogan;
            div.appendChild(p);
            df.appendChild(div);
        });
        section.appendChild(df);
    },
    navDetails: function (ev) {
        ev.preventDefault();
        window.scrollTo(0, 0);
        let h2 = ev.currentTarget;
        //extract the id from the heading
        let id = h2.getAttribute('data-key');
        //change the url and save the id in the history.state
        console.log(`#details/${id}`);
        history.pushState({
            "id": id
        }, "Details", `#details/${id}`);
        document.title = `Details for Item ${id}`;
        //get the info about this item
        let obj = app.getItem(id);
        //pass it to a function to display those details
        app.showDetails(obj);
    },
    getItem: function (id) {
        //retrieve an object from our JSON data
        //where the id matches the one passed to this function
//        console.log(id);
        //dummy data for demonstration purposes
        let match;
        app.DATA.forEach((cars)=>{
//            console.log(cars);
            if(cars.id ==id)
                {
                   
                    match=cars;
//                     console.log(match);
                }
            
        })
        return match;
    },
    showDetails: function (obj) {
//        console.log(obj);
        //navigate to the second page
        document.getElementById('list-page').classList.remove('active');
        document.getElementById('details-page').classList.add('active');
        //set the title of the selected propertys
        //loop through the obj properties with a for in loop
         let span = document.querySelector('.details-title');
        span.textContent = obj.companyName;
        
        //create some HTML for each property...
                 let section = document.querySelector('#details-page .content');
        let df = document.createDocumentFragment();
        section.innerHTML= "";
        obj.models.forEach((model)=>{
                let div =document.createElement('div');
            div.classList.add('item-card');
            
              let img = document.createElement('img');
            img.setAttribute('src',model.img);
            img.setAttribute('alt','logo');
            img.classList.add('icon');
            div.appendChild(img);
            
           let h2 =document.createElement('h2');
            h2.classList.add('item-title');
            h2.textContent=model.modelName;
            div.appendChild(h2);
            
            model.details.forEach((detail)=>{
                let div2 =document.createElement('div');
                div2.classList.add('item-desc');
                
                let p1 =document.createElement('p');
                p1.textContent="Top Speed :"+detail.topSpeed;
                div2.appendChild(p1);
                
                let p2 =document.createElement('p');
                p2.textContent="price :"+detail.price;
                div2.appendChild(p2);
                
                let p3 =document.createElement('p');
                p3.textContent="Year :"+detail.year;
                div2.appendChild(p3);
    
                
                div.appendChild(div2);
            })
            
            
            
                df.appendChild(div);
        })
        section.appendChild(df);
    },
    backHome: function (ev) {
        if (ev) {
            ev.preventDefault();
            //only add to the pushState if the user click OUR back button
            //don't do this for the browser back button
            history.pushState({}, "List", `#list`);
            document.title = 'List of Items';
        }
        document.getElementById('list-page').classList.add('active');
        document.getElementById('details-page').classList.remove('active');
    },
    browserBack: function (ev) {
        console.log('user hit the browser back button');
        //the browser will change the location hash.
        //use the updated location.hash to display the proper page
        if (location.hash == '#list') {
            console.log('show the list page');
            //we want to show the list page
            app.backHome();
            //NOT passing the new MouseEvent('click')
        } else {
            //we want to display the details
            console.log('show the details');
            let id = location.hash.replace("#details/", "");
            //use the id number from the hash to fetch the proper data
            let obj = app.getItem(id);
            //pass it to a function to display those details
            app.showDetails(obj);
        }
    }
}

let loadEvent = ('deviceready' in document) ? 'deviceready' : 'DOMContentLoaded';
document.addEventListener(loadEvent, app.init);
