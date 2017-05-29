 
//ao carregar a página chame o método init 
onload= init;

//variáveis para pegar o retorno do servidor. Tais variaveis guardam os objetos JSON das consultas
var objJSON;
var objSetor;

//variáveis globais para facilitar os métodos de terem acesso a elas
var numeroDeObjetos=0;
var numeroSetores =0;
var totalOSTestada= 0;
var totalOSComDefeito=0;
total = 0;
var numeroDeBugEmPrducao=0;
var defeitosEncontrados = 0;
var defeitosRemovidos = 0;

function init(){
	//relacionando eventos em botões e campos a métodos.
    var btn = document.getElementById("gerar");
    btn.onclick = requisitarDadosDoWebServiceOS;
	
	var taIntroducao = document.getElementById("taIntroducao");
    taIntroducao.onblur =inserirTextoNoHtmlIntro;
	var introducao = document.getElementById("introducao");
	introducao.onclick = inserirTextoNoCampoIntro;
	
	var ta1 = document.getElementById("ta1");
    ta1.onblur =inserirTextoNoHtml1;
	var td1 = document.getElementById("d1");
	td1.onclick = inserirTextoNoCampo1;
	
	var ta2 = document.getElementById("ta2");
    ta2.onblur =inserirTextoNoHtml2;
	var td2 = document.getElementById("d2");
	td2.onclick = inserirTextoNoCampo2;
	
	var ta3 = document.getElementById("ta3");
    ta3.onblur =inserirTextoNoHtml3;
	var td3 = document.getElementById("d3");
	td3.onclick = inserirTextoNoCampo3;
	
	var ta4 = document.getElementById("ta4");
    ta4.onblur =inserirTextoNoHtml4;
	var td4 = document.getElementById("d4");
	td4.onclick = inserirTextoNoCampo4;
	
	var ta5 = document.getElementById("ta5");
    ta5.onblur =inserirTextoNoHtml5;
	var td5 = document.getElementById("d5");
	td5.onclick = inserirTextoNoCampo5;
	
	var ta6 = document.getElementById("ta6");
    ta6.onblur =inserirTextoNoHtml6;
	var td6 = document.getElementById("d6");
	td6.onclick = inserirTextoNoCampo6;
	
	
	var btnInserirNaTabela =document.getElementById("inserirNaTabela");
	btnInserirNaTabela.onclick = inserirQuantidadeDeDefeitos;	 
	var tabela = document.getElementById("tabela");
	tabela.onclick = editarQuantidadeDeDefeitos;
	
	
	
}

//requisitando todas as os's da versão e criando a tabela 
function requisitarDadosDoWebServiceOS(){
	var httpReq = new XMLHttpRequest();
	var nVersao = document.getElementById("n1").value;
	httpReq.onreadystatechange = function(){
		if(httpReq.readyState == 4){
			requisitarDadosDoWebServiceSetor();
			objJSON = JSON.parse(httpReq.responseText);
			numeroDeObjetos = Object.keys(objJSON).length;
			criarTabela();
		}
	};
	
	httpReq.open("GET",	"http://localhost:8080/findByObservacaoVersao?observacao=V%20"+nVersao,true);
	httpReq.withCredentials = true;
	httpReq.send();
	
	
}

//requisitando todos os setores da versão
function requisitarDadosDoWebServiceSetor(){
	var httpReq = new XMLHttpRequest();
	var nVersao = document.getElementById("n1").value;
	httpReq.onreadystatechange = function(){
		if(httpReq.readyState == 4){
			
			objSetor = JSON.parse(httpReq.responseText);
			numeroSetores = Object.keys(objSetor).length;
						
		}
	};
	
	httpReq.open("GET",	"http://localhost:8080/setor?observacao=V%20"+nVersao,false);
	httpReq.withCredentials = true;
	httpReq.send();
	
	
}

//cria tabela e já insere dados relacionado a as pendencias de teste, ajustes de testes, 
//ajuste de revisão de código e revisão de código
function criarTabela(){
   
	
    var tabela = document.getElementById("tabela");
	
	//limpando a tabela
	  while (tabela.rows.length > 1)
     { tabela.deleteRow(tabela.rows.length - 1);
	 }
    
      for(var i = 0;i< numeroDeObjetos; i++){
         var linha = document.createElement("tr");
		 var nPendencias = Object.keys(objJSON[i].pendencias).length;
						
        
        for (var j=0; j<=6 ;j++){
			var cell = document.createElement("td");
			
			if(j==0){
				var cellText = document.createTextNode(objJSON[i].cod_os_nominal);
				cell.appendChild(cellText);
				linha.appendChild(cell);
				
			}else if(j==1){
				var total=0;
				var str = "REVISÃO DE CÓDIGO";
				for(var x=0; x < nPendencias; x++){
					if(str.localeCompare(objJSON[i].pendencias[x].descricao)== 0){
						total++;
					}					
				}
				var text = document.createTextNode(total);
				cell.appendChild(text);
				linha.appendChild(cell);
				
			}else if(j==2){
				var total=0;
				var str = "AJUSTES DE REVISÃO DE CÓDIGO";
				for(var x=0; x < nPendencias; x++){
					if(str.localeCompare(objJSON[i].pendencias[x].descricao)== 0){
						total++;
					}					
				}
				var text = document.createTextNode(total);
				cell.appendChild(text);
				linha.appendChild(cell);
					
			}else if(j==3){
				var total=0;
				var str = "TESTE";
				for(var x=0; x < nPendencias; x++){
					if(str.localeCompare(objJSON[i].pendencias[x].descricao)== 0){
						total++;
						
					}					
				}
				if(total>0){
					totalOSTestada++;
				}
				var text = document.createTextNode(total);
				cell.appendChild(text);
				linha.appendChild(cell);
				
				
			}else if(j==4){
				
				var total = 0;
				var str = "AJUSTE DE TESTE";
				for(var x=0; x < nPendencias; x++){
					if(str.localeCompare(objJSON[i].pendencias[x].descricao)== 0){
						total++;
					}
				}
				if(total>0){
						totalOSComDefeito++;
					}
				var text = document.createTextNode(total);
				cell.appendChild(text);
				linha.appendChild(cell);
				
			}else if(j==5){
				var input = document.createElement("input");
				input.className = 'campoTextoDefeitosEncontrados';
				cell.appendChild(input);
				linha.appendChild(cell);
			}else{
				var input =document.createElement("input");
				input.className = 'campoTextoDefeitosRemovidos';
				cell.appendChild(input);
				linha.appendChild(cell);
			}
		}	
        
        tabela.appendChild(linha);
    }
    
	//chama os outros métodos para gerar os outros gráficos e tabelas 
       porcentagemPrioridade();
	   porcentagemOcorrência();
	   porcentagemDeOSTestadas();
	   porcentagemDeOSTestadasComDefeito();
	   porcentagemDeTipoManutencao();
	   quantidadeOcorrenciaTipoManutencao();
	   quantidadeOSPorSetor();
	  
	   
}



function porcentagemPrioridade(){
	var vetCont = [0,0,0,0];//vetor pra contar quantas vezes cada prioridade aparece na versão
	
	
	for(var i=0;i< numeroDeObjetos;i++){
		var str = objJSON[i].prioridade.descricao;
		
		if(str.localeCompare("BAIXA")==0){
			vetCont[0]++;			
		}else if(str.localeCompare("MÉDIA")==0){
			vetCont[1]++;
		}else if(str.localeCompare("ALTA")==0){
			vetCont[2]++;
		}else{
			vetCont[3]++;
		}
	}	
		
		//gerando gráfico
		$(document).ready(function() {  
			   var chart = {      
				  type: 'pie',     
				  options3d: {
					 enabled: true,
					 alpha: 45,
					 beta: 0
				  }
			   };
			   var title = {
				  text: 'Abertura de Ordem de Serviço pela Prioridade'   
			   };   
			   var tooltip = {
				  pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			   };

			   var plotOptions = {
				  pie: {
					  allowPointSelect: true,
					  cursor: 'pointer',
					  depth: 35,
					  dataLabels: {
						 enabled: true,
						 format: '{point.name}'
					  }
				  }
			   };   
			   var series= [{
					 type: 'pie',
						name: 'Prioridade com',
						data: [
							['BAIXA',  parseFloat(((vetCont[0]*100)/numeroDeObjetos).toFixed(2))],
							['MÉDIA',    parseFloat(((vetCont[1]*100)/numeroDeObjetos).toFixed(2))  ],
							['ALTA', parseFloat(((vetCont[2]*100)/numeroDeObjetos).toFixed(2)) ],
							['MUITO ALTA',   parseFloat(((vetCont[3]*100)/numeroDeObjetos).toFixed(2)) ],
							
						]
			   }];     
		
		
			var json = {};   
			json.chart = chart; 
			json.title = title;     
			json.tooltip = tooltip;  
			json.series = series;
			json.plotOptions = plotOptions;
			 $('#campo2').highcharts(json);  
					
		
		});	
	
}


function porcentagemOcorrência(){
	var vetCont = [0,0,0,0,0];
	
	for(var i=0;i< numeroDeObjetos;i++){
		var str = objJSON[i].ocorrencias[0].descricao;
	
		if(str.localeCompare("MELHORIA NO SISTEMA")==0){
				vetCont[0]++;		
			}else if(str.localeCompare("BUG EM PRODUÇÃO")==0){
				vetCont[1]++;
				numeroDeBugEmPrducao++;
			}else if(str.localeCompare("OCORRÊNCIA EM PRODUÇÃO")==0){
				vetCont[2]++;
			}else if(str.localeCompare("SOLICITAÇÃO")==0){
				vetCont[3]++;
			}else{
				vetCont[4]++;
			}
	}		
			
					
			
			$(document).ready(function() {  
			   var chart = {      
				  type: 'pie',     
				  options3d: {
					 enabled: true,
					 alpha: 45,
					 beta: 0
				  }
			   };
			   var title = {
				  text: 'Abertura de Ordem de Serviço pelo tipo de Ocorrência'   
			   };   
			   var tooltip = {
				  pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			   };

			   var plotOptions = {
				  pie: {
					  allowPointSelect: true,
					  cursor: 'pointer',
					  depth: 35,
					  dataLabels: {
						 enabled: true,
						 format: '{point.name}'
					  }
				  }
			   };   
			   var series= [{
					 type: 'pie',
						name: 'Ocorrência com',
						data: [
							['MELHORIA NO SISTEMA',  parseFloat(((vetCont[0]*100)/numeroDeObjetos).toFixed(2))],
							['BUG EM PRODUÇÃO',    parseFloat(((vetCont[1]*100)/numeroDeObjetos).toFixed(2))  ],
							['OCORRÊNCIA EM PRODUÇÃO', parseFloat(((vetCont[2]*100)/numeroDeObjetos).toFixed(2)) ],
							['SOLICITAÇÃO',   parseFloat(((vetCont[3]*100)/numeroDeObjetos).toFixed(2)) ],
							['DATAFIX',   parseFloat(((vetCont[4]*100)/numeroDeObjetos).toFixed(2))],
						]
			   }];     
		
		
			var json = {};   
			json.chart = chart; 
			json.title = title;     
			json.tooltip = tooltip;  
			json.series = series;
			json.plotOptions = plotOptions;
			 $('#campo3').highcharts(json);  
					
		
		});	
				
}




function porcentagemDeOSTestadas(){
	var totalOSNaoTestada=numeroDeObjetos-totalOSTestada;
	
	$(document).ready(function() {  
			   var chart = {      
				  type: 'pie',     
				  options3d: {
					 enabled: true,
					 alpha: 45,
					 beta: 0
				  }
			   };
			   var title = {
				  text: 'Ordem de Serviços Testadas'   
			   };   
			   var tooltip = {
				  pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			   };

			   var plotOptions = {
				  pie: {
					  allowPointSelect: true,
					  cursor: 'pointer',
					  depth: 35,
					  dataLabels: {
						 enabled: true,
						 format: '{point.name}'
					  }
				  }
			   };   
			   var series= [{
					 type: 'pie',
						name: 'com',
						data: [
							['ORDENS DE SERVIÇO TESTADAS',  parseFloat(((totalOSTestada*100)/numeroDeObjetos).toFixed(2))],
							['ORDENS DE SERVIÇO NÃO TESTADAS',  parseFloat(((totalOSNaoTestada*100)/numeroDeObjetos).toFixed(2))  ],
							
						]
			   }];     
		
		
			var json = {};   
			json.chart = chart; 
			json.title = title;     
			json.tooltip = tooltip;  
			json.series = series;
			json.plotOptions = plotOptions;
			 $('#campo4').highcharts(json);
	
		});	
}




function porcentagemDeOSTestadasComDefeito(){
	var totalOSSemDefeito =  totalOSTestada - totalOSComDefeito;
	
	$(document).ready(function() {  
			   var chart = {      
				  type: 'pie',     
				  options3d: {
					 enabled: true,
					 alpha: 45,
					 beta: 0
				  }
			   };
			   var title = {
				  text: 'Incidência de Defeitos'   
			   };   
			   var tooltip = {
				    followPointer : false,
					followTouchMove:false,
				    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			   };

			   var plotOptions = {
				  pie: {
					  allowPointSelect: true,
					  cursor: 'pointer',
					  depth: 35,
					  dataLabels: {
						 enabled: true,
						 format: '{point.name}'
					  }
				  }
			   };   
			   var series= [{
					 type: 'pie',
						name: 'com',
						data: [
							['COM INCIDÊNCIA DE DEFEITOS',  parseFloat(((totalOSComDefeito*100)/numeroDeObjetos).toFixed(2))],
							['SEM INCIDÊNCIA DE DEFEITOS',  parseFloat(((totalOSSemDefeito*100)/numeroDeObjetos).toFixed(2))  ],
							
						]
			   }];     
		
		
			var json = {};   
			json.chart = chart; 
			json.title = title;     
			json.tooltip = tooltip;  
			json.series = series;
			json.plotOptions = plotOptions;
			 $('#campo5').highcharts(json);
	
		});	
}
	
	
	
function porcentagemDeTipoManutencao(){
	var vetCont = [0,0,0,0];
	
	for(var i=0;i< numeroDeObjetos;i++){
		var str = objJSON[i].tipoManutencao.descricao;
	
		if(str.localeCompare("CUSTUMIZAÇÃO")==0){
				vetCont[0]++;		
		}else if(str.localeCompare("INTERNA")==0){
				vetCont[1]++;				
		}else if(str.localeCompare("DÚVIDAS")==0){
				vetCont[2]++;
		}else {
			vetCont[3]++;
		}
		
	}	
	
	$(document).ready(function() {  
			   var chart = {      
				  type: 'pie',     
				  options3d: {
					 enabled: true,
					 alpha: 45,
					 beta: 0
				  }
			   };
			   var title = {
				  text: 'Abertura de Ordem de Serviço pelo tipo de Manutenção'   
			   };   
			   var tooltip = {
				  pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			   };

			   var plotOptions = {
				  pie: {
					  allowPointSelect: true,
					  cursor: 'pointer',
					  depth: 35,
					  dataLabels: {
						 enabled: true,
						 format: '{point.name}'
					  }
				  }
			   };   
			   var series= [{
					 type: 'pie',
						name: 'com',
						data: [
							['CUSTUMIZAÇÃO',  parseFloat(((vetCont[0]*100)/numeroDeObjetos).toFixed(2))],
							['INTERNA',    parseFloat(((vetCont[1]*100)/numeroDeObjetos).toFixed(2))  ],
							['DÚVIDAS', parseFloat(((vetCont[2]*100)/numeroDeObjetos).toFixed(2)) ],
							['PROBLEMAS',   parseFloat(((vetCont[3]*100)/numeroDeObjetos).toFixed(2)) ],
							
						]
			   }];     
		
		
			var json = {};   
			json.chart = chart; 
			json.title = title;     
			json.tooltip = tooltip;  
			json.series = series;
			json.plotOptions = plotOptions;
			 $('#campo6').highcharts(json);  
					
		
		});	
	
	
}	
	
function quantidadeOcorrenciaTipoManutencao(){
	var interna = 0;
	var costumizacao = 0;
	
	for(var i=0; i<objJSON.length;i++){
		var strO = objJSON[i].ocorrencias[0].descricao;
		var strTM = objJSON[i].tipoManutencao.descricao;
		
		if(strO.localeCompare("SOLICITAÇÃO")==0){
			if(strTM.localeCompare("INTERNA")==0){
				interna++;
			}
			if(strTM.localeCompare("CUSTUMIZAÇÃO")==0){
				costumizacao++;
			}	
		}
	}
	
	
	$(document).ready(function() {
		   var chart ={
			   type: 'column'
		   };		   
		   
		   var title = {
			  text: 'Quantidade Solicitação abertas pelo tipo de Manutenção'   
		   };
		   
		   	   
		   var xAxis = {
			  categories: ['Quantidade'],
			    crosshair: true
		   };
		   
		   var yAxis = {
			  min:0,
			};   

		   var tooltip = {
			    pointFormat:'<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
				shared: true
		   }

		   
		   
		   var plotOptions = {
			  column: {
				 pointPadding: 0.2,
				 borderWidth: 0
			  }
		   };

		   var credits = {
			  enabled: false
		   };
		   
		   var series =  [
			  {
				 name: 'INTERNA',
				 data: [interna]
			  }, 
			  {
				 name: 'CUSTUMIZAÇÃO',
				 data: [costumizacao]
			  }, 
			  
	];

   var json = {};
   json.chart =chart;
   json.title = title;
   json.xAxis = xAxis;
   json.yAxis = yAxis;
   json.tooltip = tooltip;
    json.plotOptions = plotOptions;  
   json.credits = credits;
   json.series = series;

   $('#campo7').highcharts(json);
	
	});
	
}	
	
	


function quantidadeOSPorSetor(){
	var lista = new Array(numeroSetores);
	var cont = new Array(numeroSetores).fill(0);
	
	
	for(var i=0;i<numeroSetores;i++){
		lista[i]=objSetor[i].setordescricao;
		
	}
	
	
	//contando quantas vezes cada setor aparece
	posicao=0;
	for(var i=0;i<numeroSetores;i++){
		
		for(var j = 0;j<numeroDeObjetos;j++){
			if(lista[i] == objJSON[j].setor.setordescricao){
				cont[posicao]++;
			}
		}
		posicao++;
	}
	
	 
	 
	var tabela2 = document.getElementById("tabela2");
	while (tabela2.rows.length > 1){
		tabela2.deleteRow(tabela2.rows.length - 1);
	 }
	 
	for(var i=0;i<numeroSetores;i++){
		var linha = document.createElement("tr");
		for(var j = 0;j< 2; j++){
			var cell = document.createElement("td");
			if(j==0){
				var cellText = document.createTextNode(lista[i]);
				cell.appendChild(cellText);
				linha.appendChild(cell);	
			}else{
				var cellText = document.createTextNode(cont[i]);
				cell.appendChild(cellText);
				linha.appendChild(cell);	
				
			}
		}
		tabela2.appendChild(linha);
	
	}
    
     
}	
	
	
//os métodos de inseri texto no campo e de editar são para inserir texto na página	
//e alterá-los	

function inserirTextoNoCampo1(){
	var text = document.createTextNode(this.value);
	document.getElementById("ta1").style.display = "block";
	document.getElementById("d1").innerHTML="";
}

function inserirTextoNoHtml1(){
	
	if(this.value != ""){
		 var text = document.createTextNode(this.value);
		document.getElementById("ta1").style.display = "none";
		var d1=document.getElementById("d1");
		d1.appendChild(text);
	}
	
}


function inserirTextoNoCampo2(){
	var text = document.createTextNode(this.value);
	document.getElementById("ta2").style.display = "block";
	document.getElementById("d2").innerHTML="";
}

function inserirTextoNoHtml2(){
	
	if(this.value != ""){
		 var text = document.createTextNode(this.value);
		document.getElementById("ta2").style.display = "none";
		var d1=document.getElementById("d2");
		d1.appendChild(text);
	}
	
}


function inserirTextoNoCampo3(){
	var text = document.createTextNode(this.value);
	document.getElementById("ta3").style.display = "block";
	document.getElementById("d3").innerHTML="";
}

function inserirTextoNoHtml3(){
	
	if(this.value != ""){
		 var text = document.createTextNode(this.value);
		document.getElementById("ta3").style.display = "none";
		var d1=document.getElementById("d3");
		d1.appendChild(text);
	}
	
}


function inserirTextoNoCampo4(){
	var text = document.createTextNode(this.value);
	document.getElementById("ta4").style.display = "block";
	document.getElementById("d4").innerHTML="";
}

function inserirTextoNoHtml4(){
	
	if(this.value != ""){
		 var text = document.createTextNode(this.value);
		document.getElementById("ta4").style.display = "none";
		var d1=document.getElementById("d4");
		d1.appendChild(text);
	}
	
}


function inserirTextoNoCampo5(){
	var text = document.createTextNode(this.value);
	document.getElementById("ta5").style.display = "block";
	document.getElementById("d5").innerHTML="";
	
}


function inserirTextoNoHtml5(){
	if(this.value != ""){
		 var text = document.createTextNode(this.value);
		document.getElementById("ta5").style.display = "none";
		var d1=document.getElementById("d5");
		d1.appendChild(text);
	}
	
}



function inserirTextoNoCampo6(){
	var text = document.createTextNode(this.value);
	document.getElementById("ta6").style.display = "block";
	document.getElementById("d6").innerHTML="";
	
}


function inserirTextoNoHtml6(){
	if(this.value != ""){
		 var text = document.createTextNode(this.value);
		document.getElementById("ta6").style.display = "none";
		var d1=document.getElementById("d6");
		d1.appendChild(text);
	}
	
}




function inserirTextoNoCampoIntro(){
	var text = document.createTextNode(this.value);
	document.getElementById("taIntroducao").style.display = "block";
	document.getElementById("introducao").innerHTML="";
}

function inserirTextoNoHtmlIntro(){
	
	if(this.value != ""){
		 var text = document.createTextNode(this.value);
		document.getElementById("taIntroducao").style.display = "none";
		var d1=document.getElementById("introducao");
		d1.appendChild(text);
	}
	
}
	
	
//Inserir os defeitos encontrados e removidos na tabela gerada dinamicamente	
//	
function inserirQuantidadeDeDefeitos(){
	var input= document.getElementsByClassName("campoTextoDefeitosEncontrados");
	//zerando a variável  
	defeitosEncontrados =0;
	
	for(var i = 0; i < input.length;i++){
		defeitosEncontrados = defeitosEncontrados + parseInt(input[i].value);
		var text = document.createTextNode(input[i].value);
		var pai = input[i].parentElement;
		input[i].style.display = "none";
		pai.appendChild(text);
		document.getElementById("inserirNaTabela").style.display = "none";
	}
	document.getElementById("inserirNaTabela").style.display = "none";
	inserirQuantidadeDeDefeitosRemovidos();
	erd();
}

function editarQuantidadeDeDefeitos(){
	
	var input= document.getElementsByClassName("campoTextoDefeitosEncontrados");
	
	
	if(input[0].style.display === "none"){
		for(var i=0;i<input.length;i++){
			var pai = input[i].parentElement;
			pai.innerHTML = ""
			var campo = document.createElement("input");
			campo.className = "campoTextoDefeitosEncontrados";
			pai.appendChild(campo);
			
		}
		//exibindo o botao de novo
		document.getElementById("inserirNaTabela").style.display = "block";
		//limpando campos da parte da métrica
		document.getElementById("TDR").innerHTML="";
		document.getElementById("TDD").innerHTML="";
	    document.getElementById("ERD").innerHTML="";
		editarQuantidadeDeDefeitosRemovidos();
	}
}

function inserirQuantidadeDeDefeitosRemovidos(){
	var input= document.getElementsByClassName("campoTextoDefeitosRemovidos");
	//zerando a variável
	defeitosRemovidos=0;
	
	for(var i = 0; i < input.length;i++){
		defeitosRemovidos = defeitosRemovidos+ parseInt(input[i].value);
		var text = document.createTextNode(input[i].value);
		var pai = input[i].parentElement;
		input[i].style.display = "none";
		pai.appendChild(text);
		
	}
	
}


function editarQuantidadeDeDefeitosRemovidos(){
	
	var input= document.getElementsByClassName("campoTextoDefeitosRemovidos");
	
	
	if(input[0].style.display === "none"){
		for(var i=0;i<input.length;i++){
			var pai = input[i].parentElement;
			pai.innerHTML = ""
			var campo = document.createElement("input");
			campo.className = "campoTextoDefeitosRemovidos";
			pai.appendChild(campo);
			
		}
			
	}
}


//Calculo da métrica eficiencia de remoção de defeitos

function erd(){
	var TDR = document.getElementById("TDR");
	var TDD = document.getElementById("TDD");
	var ERD = document.getElementById("ERD");
	
	var text = document.createTextNode(defeitosEncontrados);
	TDD.appendChild(text);
	text = document.createTextNode(defeitosRemovidos);
	TDR.appendChild(text);
	var valor = (defeitosRemovidos/defeitosEncontrados)*100;
	text = document.createTextNode(parseFloat(valor).toFixed(2)+"%");
	ERD.appendChild(text);
}