// N  = Número total de Sítios Atômicos
// Nv = Número de Lacunas
// Qv = Energia necessária para formação de uma lacuna. [ev/K^-1]
// T  = Temperatuda em kelvin(K)
// k  = Constante de Boltzmann [ev/K^-1 or j/K^-1]
// Na = Constante de Avogadro [mol^-1]
// p  = Massa Especifica [g/mol]
// A  = Peso Atômico [g/mol^-1]

// Consts
const kelvinFusion = 273.15;
const avogadroConstant = 6.02214086e+23; // mol^-1
const boltzmannConstant = {
    jK: 1.380649e-23, // Joule/Kelvin(j/k^-1)
    eK: 8.6173324e-5 // Elétron-Volt/Kelvin (ev/At^-1)
}

// Page elements
var nAtomsDiv = document.getElementById("nAtomsDiv");
var nEnergyDiv = document.getElementById("nEnergyDiv");
var nVacancyDiv = document.getElementById("nVacancyDiv");
var nSiteDiv = document.getElementById("nSiteDiv");

// Result fields
var resultAtoms = document.getElementById("nAtoms");
var resultVacancy = document.getElementById("nVacancy");
var resultnSite = document.getElementById("nSite");
var resultnEnergy = document.getElementById("nEnergy");

// Inputs
var inputN = document.getElementById("inputN");
var inputNv = document.getElementById("inputNv");
var inputNa = document.getElementById("inputNa");
var inputQv = document.getElementById("inputQv");
var inputP = document.getElementById("inputP");
var inputA = document.getElementById("inputA");
var inputKb = document.getElementById("inputK");
var inputT = document.getElementById("inputT");

// Globals
var globals = {
    n: NaN, // at/m^-3
    nv: NaN, // vac/m^-3
    nvn: NaN, // Nv/N
    t: NaN, // kelvin
    qv: NaN, // ev/K^-1
    na: NaN, // mol^-1
    p: NaN, // g/cm^-3
    a: NaN, // g/mol^-1
    kb: NaN
}

function totalAtomsPerUnity(na, p, a, element) {
    element.innerHTML = "N = N<sub>a</sub> x ρ / A<sub>At</sub>";
    element.innerHTML += "<br>N = " + na + " x " + p.toExponential() + " / " + a;  

    var n = ((na*p)/a);
    element.innerHTML += "<br>N = " + n;

    return n;
}

function totalVacancy(n, qv, kb, t, element) {
    element.innerHTML = "N<sub>v</sub> = N x exp(-Q<sub>v</sub> / k<sub>B</sub> x T<sub>K</sub>)";
    element.innerHTML += "<br>N<sub>v</sub> = " + n + " x exp(-" + qv + " / " + kb.toExponential() +" x " + t + ")";
    
    var valExp = Math.exp(-qv / (kb * t));
    element.innerHTML += "<br>N<sub>v</sub> = " + n + " x " + valExp.toExponential();

    var nv = n * valExp;
    element.innerHTML += "<br>N<sub>v</sub> = " + nv;
   
    return nv;
}

function siteFraction(qv, kb, t, element) {
    element.innerHTML = "N<sub>v</sub> = N x exp(-Q<sub>v</sub> / k<sub>B</sub> x T<sub>K</sub>)";
    element.innerHTML += "<br>N<sub>v</sub>/N = exp(-Q<sub>v</sub> / k<sub>B</sub> x T<sub>K</sub>)";
    element.innerHTML += "<br>N<sub>v</sub>/N = exp(-" + qv + " / " + kb.toExponential() + " x " + t + ")";
   
    var sub = (kb * t)
    element.innerHTML += "<br>N<sub>v</sub>/N = exp(-" + qv + " / " + sub.toExponential() + ")";

    var exp = Math.exp(-qv / sub);
    element.innerHTML += "<br>N<sub>v</sub>/N = " + exp.toExponential();

    return exp;
}

function activationEnergy(n, nv, kb, t, element) {
    nvn = nv/n;
    var log_nvn = Math.log(nvn);
    var kT = kb * t;
    var qv = (log_nvn * (-1)) * kT;

    element.innerHTML = "N<sub>v</sub> = N x exp(-Q<sub>v</sub> / kB x T<sub>K</sub>)";
    element.innerHTML += "<br>N<sub>v</sub>/N = exp(-Q<sub>v</sub> / kB x T<sub>K</sub>)";
    element.innerHTML += "<br>ln([N<sub>v</sub>/N]) = -Q<sub>v</sub> / kB x T<sub>K</sub>";
    element.innerHTML += "<br>ln([" + nv + " / " + n + "]) = (-Qv / " + kb.toExponential() + " x " + t + ")";
    element.innerHTML += "<br>" + log_nvn.toExponential() + " = (-Qv / " + kT.toExponential() + ")";
    element.innerHTML += "<br>Qv = " + kT.toExponential() + " x " + (log_nvn*(-1)).toExponential();
    element.innerHTML += "<br>Qv = " + qv.toExponential();

    return qv;
}

function hideElement(element) {
    element.style.visibility = "hidden";
}

function showElement(element) {
    element.style.visibility = "visible";
}

function checkViability() {

    if(!isNaN(globals.na) && !isNaN(globals.p) && !isNaN(globals.a)) {
        var n = totalAtomsPerUnity(parseFloat(globals.na), parseFloat(globals.p), parseFloat(globals.a) , resultAtoms)
        globals.n = n;
        inputN.value = n;
        showElement(nAtomsDiv);
    }
    else {
        hideElement(nAtomsDiv);
        inputN.value = "";
    }

    if(!isNaN(globals.n) && !isNaN(globals.qv) && !isNaN(globals.kb) && !isNaN(globals.t)) {
        console.log("hello");
        var nv = totalVacancy(parseFloat(globals.n), parseFloat(globals.qv), parseFloat(globals.kb), parseFloat(globals.t), resultVacancy);
        inputNv.value = nv;
        showElement(nVacancyDiv);
    }
    else {
        hideElement(nVacancyDiv);
        inputNv.value = "";
    }


    //N<v= N x exp(-Qv / kB x T)


   //n
    //nv
    //nvn
   // t
   // qv
    //na
   // p
   // a
}

function initialize() {
    hideElement(nAtomsDiv);
    hideElement(nEnergyDiv);
    hideElement(nVacancyDiv);
    hideElement(nSiteDiv);

    inputN.addEventListener("change", function() {
        if(inputN.value == ""){
            globals.n = NaN;
        }
        else {
            globals.n = inputN.value;
        }
   
        checkViability();
    });
    inputNv.addEventListener("change", function() {
        if(inputNv.value == ""){
            globals.nv = NaN;
        }
        else {
            globals.nv = inputNv.value;
        }

        checkViability();
    });
    inputNa.addEventListener("change", function() {    
        if(inputNa.value == ""){
            globals.na = NaN;
        }
        else {
            globals.na = inputNa.value;
        }

        checkViability();
    });
    inputQv.addEventListener("change", function() {
        if(inputQv.value == ""){
            globals.qv = NaN;
        }
        else {
            globals.qv = inputQv.value;
        }

        checkViability();
    });
    inputP.addEventListener("change", function() {
        if(inputP.value == ""){
            globals.p = NaN;
        }
        else {
            globals.p = inputP.value;
        }

        checkViability();
    });
    inputA.addEventListener("change", function() {
        if(inputA.value == ""){
            globals.a = NaN;
        }
        else {
            globals.a = inputA.value;
        }

        checkViability();
    });
    inputKb.addEventListener("change", function() {
        if(inputK.value == ""){
            globals.kb = NaN;
        }
        else {
            globals.kb = inputKb.value;
        }

        checkViability();
    });
    inputT.addEventListener("change", function() {
        if(inputT.value == ""){
            globals.t = NaN;
        }
        else {
            globals.t = inputT.value;
        }

        checkViability();
    });

    //n = totalAtomsPerUnity(avogadroConstant, p * 1e6, a, e_nAtoms);
    //qv = activationEnergy(n, nv, boltzmannConstant.eK, t, e_nEnergy);
}

initialize();