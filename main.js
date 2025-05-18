import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
import { detecIcon,  detecType, setStorage } from "./helpers.js";
//! HTML'den gelenler
const form = document.querySelector("form");
const list = document.querySelector("ul");

//! Olay İzleyicileri
form.addEventListener("submit", handleSubmit);
list.addEventListener("click", handleClick);
//! Ortak Kullanım Alanı
var map;
var layerGroup = [];
var notes = JSON.parse(localStorage.getItem("notes")) ||  [];
var coords = [];

/*
/*Kullanıcının konumunu öğrenmek için getCurrenPosition metodunu kullandık ve bizden iki parametre istedi:
*1.Kullanıcı konum izin verdiğinde çalışacak fonsksiyondur.
*2.Kullanıcı konum izni vermediğinde çalışacak fonksiyondur.
*/
navigator.geolocation.getCurrentPosition(loadMap, errorFunction);
function errorFunction(){
 
}

//* Haritaya tıklanınca çalışır.
function onMapClick(e) {
    //*Haritaya tıklanıldığında form bileşenini display yaptık.
    form.style.display ="flex";
    console.log(e)
    //* Haritada tıkladığınız yerin koordinatlarını coords dizisi içerisine aktardık
    coords = [e.latlng.lat, e.latlng.lng];
    console.log(coords);
}
//* Kullanıcının konumuna göre haritayı ekrana aktarır.
function loadMap(e){
    //*1.Haritanın kurulumu
     map = L.map("map").setView([e.coords.latitude, e.coords.longitude], 10);
   L.control;
  //*2.Haritanın nasıl gözükeceğini belirler
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: 
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
//* 3.Haritada ekrana basılacak imleçleri tutacağımız katman
layerGroup = L.layerGroup().addTo(map);

//*Localden gelen notesları listeleme
renderNotList(notes)

//*Haritada bir tıklanma olduğunda çalışacak fonksiyon.
map.on("click", onMapClick);
}

function renderMarker(item){
// L.marker([50.505, 30.57], {icon: myIcon}).addTo(map);
//Marker oluşturur
L.marker(item.coords, {icon: detecIcon(item.status) })
.addTo(layerGroup) // imleçlerin olduğu katmanaekler
.bindPopup(`${item.desc}`);// üzerine tıklanınca açılacak popup ekleme
}

function handleSubmit(e){
    e.preventDefault();//*Sayfanın yenilenmesini engeller

const desc = e.target[0].value;// formun içerisindeki text inputun değerini alma
const date =e.target[1].value;// formun içerisindeki date inputunun değerini alma
const status = e.target[2].value;//formun içerisindeki select yapısının değerini alma 

notes.push({
    id: uuidv4(),
    desc,
    date,
    status,
    coords
});

//* Local storage güncelle
setStorage(notes);
//* renderNotList fonsksiyonuna parametre olarak notes dizisini gönderdik.
renderNotList(notes)

//*Form gönderildiğinde kapat
form.style.display = "none";
}

//* Ekrana notları aktaracak fonksiyon
function renderNotList(item){
    //*Notlar (list) alanını temizler
    list.innerHTML = "";
    //*Markerları temizler
    layerGroup.clearLayers();
    //*Herbir not için fonksiyon li etiketi oluştururve içerisini günceller.
  item.forEach((item)=>{
const listElement = document.createElement("li"); //* bir lietiketi oluşturur
listElement.dataset.id = item.id; //* li etiketine data-id  özelliği ekleme

listElement.innerHTML = `
<div>
    <p>${item.desc}</p>
    <p><span>Tarih:</span>${item.date}</p>
    <p><span>Durum:</span>${detecType(item.status)}</p>
</div>
<i class="bi bi-x" id="delete"></i>
<i class="bi bi-airplane-fill" id="fly"></i>

`;
list.insertAdjacentElement('afterbegin',listElement);

renderMarker(item);
});
//*Notes alanında tıklanma olayını izler.
}
function handleClick(e){
  //*Güncellenecek elemanın id'sini öğrenmek için pareNtElement yöntemini kullandık
  const id = e.target.parentElement.dataset.id;
  console.log(id);
  if(e.target.id === "delete"){
    //*idsini bildiğimiz elemanı diziden filter yöntemi ile kaldırdık
  notes = notes.filter ((note) => note.id != id);
  console.log(notes);
  setStorage(notes); //*LocalStorage güncelle
  renderNotList(notes);//* Ekranı güncelle
  }

  if(e.target.id === "fly"){
    //* Tıkladığımız elemanın idsi ile iiçerindeki elemanlardan herhangi birinin idsi eşleşirse bul.
    const note = notes.find((note) => note.id ==id); 
    console.log(note);
    map.flyTo(note.coords); //* Hariyatı bulduğumuz elemana yönlendirmesi için flyTo metodunu kullandık.
  }
}
