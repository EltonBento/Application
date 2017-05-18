 
onload= init;

var objJSON;
var numeroDeObjetos;
var totalOSTestada= 0;
var totalOSComDefeito=0;
total = 0;
var numeroDeBugEmPrducao=0;

function init(){
    var btn = document.getElementById("gerar");
    btn.onclick = requisitarDadosDoWebService;
	
	
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
	
	
	
}


function requisitarDadosDoWebService(){
	var httpReq = new XMLHttpRequest();
	var nVersao = document.getElementById("n1").value;
	httpReq.onreadystatechange = function(){
		if(httpReq.readyState == 4){
			objJSON = JSON.parse(httpReq.responseText);
			criarTabela();
		}
	};
	
	httpReq.open("GET",	"http://localhost:8080/findByObservacaoVersao?observacao=V%20"+nVersao,true);
	httpReq.withCredentials = true;
	httpReq.send();
	
	
}



function criarTabela(){
   
    numeroDeObjetos = Object.keys(objJSON).length;
	
    var tabela = document.getElementById("teste");
	
	//limpando a tabela
	  while (tabela.rows.length > 1)
     { tabela.deleteRow(tabela.rows.length - 1);
	 }
    
      for(var i = 0;i< numeroDeObjetos; i++){
         var linha = document.createElement("tr");
		 var nPendencias = Object.keys(objJSON[i].pendencias).length;
						
        
        for (var j=0; j<=5 ;j++){
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
				
			}else{
				var input = document.createElement("input");
				input.class= 'campoTexto';
				cell.appendChild(input);
				linha.appendChild(cell);
			}
			
        }
        tabela.appendChild(linha);
    }
    
       porcentagemPrioridade();
	   porcentagemOcorrência();
	   porcentagemDeOSTestadas();
	   porcentagemDeOSTestadasComDefeito();
	   alert(totalOSTestada);
	   alert(totalOSComDefeito);
	   
}



function porcentagemPrioridade(){
	var vetCont = [0,0,0,0];
	
	
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
	 
	
		var campo2 = document.getElementById("campo2");
		
		var text = document.createTextNode("total de "+numeroDeObjetos+ " > 100%");
		//campo2.appendChild(text);
		for(var j=0;j<4;j++){
			var p= (vetCont[j]*100)/numeroDeObjetos;
			
			switch(j){
				case 0:text = document.createTextNode("Baixa: "+parseFloat(p.toFixed(2))+ "%");break;
				case 1:text = document.createTextNode("Média: "+parseFloat(p.toFixed(2))+ "%");break;
				case 2:text = document.createTextNode("Alta: "+parseFloat(p.toFixed(2))+ "%");break;
				case 3:text = document.createTextNode("Muito Alta: "+parseFloat(p.toFixed(2))+ "%");
			}
			campo2.appendChild(text);
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
			
			var campo3 = document.getElementById("campo3");
		
		var text = document.createTextNode("total de "+numeroDeObjetos+ " > 100%");
		//campo2.appendChild(text);
		for(var j=0;j<5;j++){
			var o= (vetCont[j]*100)/numeroDeObjetos;
			
			switch(j){
				case 0:text = document.createTextNode("MELHORIA NO SISTEMA: "+parseFloat(o.toFixed(2))+ "%");break;
				case 1:text = document.createTextNode("BUG EM PRODUÇÃO: "+parseFloat(o.toFixed(2))+ "%");break;
				case 2:text = document.createTextNode("OCORRÊNCIA EM PRODUÇÃO: "+parseFloat(o.toFixed(2))+ "%");break;
				case 3:text = document.createTextNode("SOLICITAÇÃO: "+parseFloat(o.toFixed(2))+ "%");break;
				case 4:text = document.createTextNode("DATAFIX: "+parseFloat(o.toFixed(2))+ "%");
			}
			campo3.appendChild(text);
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
				  text: 'Cobertura dos testes'   
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

	
	


