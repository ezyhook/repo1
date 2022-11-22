let rpc_test1 = "https://api.testnet.solana.com";
let rpc_test = "https://fittest-serene-liquid.solana-testnet.discover.quiknode.pro/f3e2b1ac3303a0b16938af9fe8985c15310c02e8/";
let rpc_main = "https://api.mainnet-beta.solana.com";
writeHTML = function(divIN, el, classOP, idOP, s)
	{
	    if (divIN == "body") {
	        let z = document.createElement(el);
	        z.className = classOP;
            z.id = idOP;
            z.innerHTML = s;
            document.body.appendChild(z);
	    } else {
            let z = document.createElement(el);
            z.className = classOP;
            z.id = idOP;
            z.innerHTML = s;
            document.getElementById(divIN).appendChild(z);
	    }
	};
let mainDIV = "<div class=row id=main_row></div>";
writeHTML ("body", "div", "tab", null, mainDIV);
//---------------------------------------------------------------

let _radio1 = document.getElementById('radio-1');
_radio1.addEventListener("change", () =>
{
	checkValidity();
});
let _radio2 = document.getElementById('radio-2');
_radio2.addEventListener("change", () =>
{
	checkValidity();
});
let _input = document.getElementById('key');
_input.addEventListener("change", () =>
{
	checkValidity();
});
let timeZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

//---------------------------------------------------------------
let _round = Math.round;
Math.round = function(number, decimals /* optional, default 0 */ )
{
	if (arguments.length == 1)
	{
		return _round(number);
	}
	let multiplier = Math.pow(10, decimals);
	return _round(number * multiplier) / multiplier;
};
//---------------------------------------------------------------
async function getrec(data, url)
{
	const response = await fetch(url,
	{
		method: 'POST',
		headers:
		{
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: data
	});
	if (response.ok)
	{
		let out = await response.json();
		return out;
	}
	else
	{
		alert('error', response.status);
	}
}
//---------------------------------------------------------------
function checkValidity()
{
	const radio1 = document.getElementById('radio-1');
	const radio2 = document.getElementById('radio-2');
	const input = document.getElementById('key');
	const val_key = input.value.replace(/\s/g, "");
  
    	if (input.value == "")
    	{
    	    input.classList.remove('text-field__input_invalid');
    		input.classList.remove('text-field__input_valid');
    		input.nextElementSibling.textContent = 'Input is empty';
    	} else if (document.getElementById(val_key) == null) {

    		let val_url;
    		if (radio1.checked)
    		{
    			val_url = rpc_test;
    		}
    		else if (radio2.checked)
    		{
    			val_url = rpc_main;
    		}
    		let data_voteinfo = '{"jsonrpc":"2.0", "id": 1, "method":"getVoteAccounts", "params": [{"votePubkey":"' + val_key + '"}]}';
    		getrec(data_voteinfo, val_url)
    			.then(function(value)
    			{
    			    if (typeof(value["result"]) == "undefined") {
    			        input.classList.remove('text-field__input_valid');
    				    input.classList.add('text-field__input_invalid');
    				    input.nextElementSibling.textContent = 'Not valid';
    			    } else {
        				let pubkey;
        				if (value["result"]["current"].length !== 0)
        				{
        					pubkey = value["result"]["current"][0]["nodePubkey"].length;
        					input.classList.remove('text-field__input_invalid');
        					input.classList.add('text-field__input_valid');
        					input.nextElementSibling.textContent = 'Pub-key is valid."';
        					//input.addEventListener("keypress", function(event) {
                            //   if (event.key === "Enter") {
                            //       event.preventDefault();
                            //       checkValidity();
                            showinfo(val_url, val_key);
                            input.value = "";
                            checkValidity();
                            //   }
    						//});
        				}
        				else if (value["result"]["delinquent"].length !== 0)
        				{
        					pubkey = value["result"]["delinquent"][0]["nodePubkey"].length;
        					input.classList.remove('text-field__input_invalid');
        					input.classList.add('text-field__input_valid');
        					input.nextElementSibling.textContent = 'Pub-key is valid."';
        					//input.addEventListener("keypress", function(event) {
                            //   if (event.key === "Enter") {
                            //       event.preventDefault();
                            //       checkValidity();
                            showinfo(val_url, val_key);
                            input.value = "";
                            checkValidity();
                            //   }
                            //});
        				}
        				else
        				{
        				    input.classList.remove('text-field__input_valid');
    				        input.classList.add('text-field__input_invalid');
    				        input.nextElementSibling.textContent = 'Not valid';
        				}
    			    }
    
    			})
    			.catch(function(error)
    			{
    				input.classList.remove('text-field__input_valid');
    				input.classList.add('text-field__input_invalid');
    				input.nextElementSibling.textContent = 'Not valid';
    				//alert("Pub-key is not valid");
    				//location.reload();
    			});
    	} else {
        input.classList.remove('text-field__input_invalid');
    	input.classList.remove('text-field__input_valid');
    	input.nextElementSibling.textContent = 'Info on display!!!';
    }
}
//---------------------------------------------------------------
function showinfo(url, vote_key)
{
    let netw;
    if (url == rpc_main ) { netw = "MAIN: ";} else { netw = "TEST: ";}
    let cellDIV = "<table><thead><th>" + netw + vote_key + "</th></thead></table><div id=rew_tab"+ vote_key +"></div><div id=info_tab"+ vote_key +"></div>";
    writeHTML ("main_row", "div", "cell", vote_key, cellDIV);
    let data_voteinfo = '{"jsonrpc": "2.0", "id": 1, "method": "getVoteAccounts", "params": [{"votePubkey": "' + vote_key + '"}]}';
	  getrec(data_voteinfo, url).then(function(value)
	{
		let key, del_status, stake;
		if (value["result"]["current"].length != 0)
		{
			key = value["result"]["current"][0]["nodePubkey"];
			stake = value["result"]["current"][0]["activatedStake"]/1000000000;
			del_status = false;
		}
		else if (value["result"]["delinquent"].length != 0)
		{
			key = value["result"]["delinquent"][0]["nodePubkey"];
			stake = value["result"]["delinquent"][0]["activatedStake"]/1000000000;
			del_status = true;
		}
		const params_t = 5;
		let data_slot = '{"jsonrpc":"2.0","id":1,"method":"getEpochInfo"}';
		let data_next = '{"jsonrpc":"2.0", "id":1, "method":"getLeaderSchedule", "params":[{"identity":"' + key + '"}]}';
		let data_BLOCKS_PRODUCTION_JSON = '{"jsonrpc":"2.0","id":1, "method":"getBlockProduction", "params": [{ "identity": "' + key + '" }]}';
		let data_time = '{"jsonrpc":"2.0", "id":1, "method":"getRecentPerformanceSamples", "params": [' + params_t + ']}';
		let data_balance = '{"jsonrpc":"2.0", "id":1, "method":"getBalance", "params": ["' + key + '"]}';
		let data_acc = '{"jsonrpc":"2.0","id": 1, "method":"getAccountInfo","params": ["' + key + '",{"encoding": "base58"}]}';
		let data_version = '{"jsonrpc":"2.0","id":1, "method":"getVersion"}';
		function echotime(secs)
		{
			let out = [];
			let day = Math.floor(secs / 86400);
			let hour = Math.floor(secs / 3600) - (day * 24);
			let minute = Math.floor(secs / 60) - (day * 24 * 60) - (hour * 60);
			let second = Math.floor(secs % 60);
			out.push(day);
			out.push(hour);
			out.push(minute);
			out.push(second);
			return out;
		}
		//---------------------------------------------------------------
		let time_const = getrec(data_time, url).then(function(value)
			{
				let time_t = 0;
				for (let g = 0; g < params_t; g++)
				{
					let samplePeriodSecs = value["result"][g]["samplePeriodSecs"];
					let numSlots = value["result"][g]["numSlots"];
					time_t += samplePeriodSecs / numSlots;
				}
				return time_t / params_t;
			})
			.catch(function(error)
			{
				console.error(error);
			});
		//---------------------------------------------------------------
		let rewards = getrec(data_slot, url).then(function(value)
			{
				let epoch = value.result.epoch;
				function showrew(values) {
				    let table1 = "";
						for (let g = 0; g < 10; g++)
						{
							let item1 = "<tr><td id="+ vote_key +"r1_" + g + "></td><td id="+ vote_key +"r2_" + g + "></td><td id="+ vote_key +"r3_" + g + "></td><td id="+ vote_key +"r4_" + g + "></td></tr>";
							table1 += item1;
						}
						let outtable1 = "<thead><th>Epoch</th><th>Commission</th><th>Rewards</th><th>Balance</th></tr></thead><tbody>" + table1 + "<th></th><th>Total:</th><th id=sumrew"+ vote_key +"></th><th></th></tr></tbody>";
						writeHTML("rew_tab" + vote_key, "table", "table", "rew"+ vote_key, outtable1);
						sum_rew = 0;
						for (let g = 0; g < 10; g++)
						{
							let ir1 = vote_key + "r1_" + g;
							let ir2 = vote_key + "r2_" + g;
							let ir3 = vote_key + "r3_" + g;
							let ir4 = vote_key + "r4_" + g;
							document.getElementById(ir1).innerHTML = values[g][0];
							document.getElementById(ir2).innerHTML = values[g][1];
							document.getElementById(ir3).innerHTML = values[g][2] / 1000000000;
							document.getElementById(ir4).innerHTML = values[g][3] / 1000000000;
							sum_rew += values[g][2] / 1000000000;
						}
						document.getElementById("sumrew" + vote_key).innerHTML = sum_rew;
				}
				
				function getrewards() {
				    let rew = [];
				    function foo(index)
            				{
            					let cu_epoch = epoch - index;
            					let data_reward = '{"jsonrpc": "2.0", "id": 1, "method": "getInflationReward", "params": [["' + vote_key + '"], {"epoch": ' + cu_epoch + '}]}';
            					let rew_in_epo = [];
            					let it = getrec(data_reward, url).then(function(value)
            					{
            						rew_in_epo.push(cu_epoch);
            						if (value.result[0] == null)
				                    	{ 
				                        	rew_in_epo.push(0);
				                        	rew_in_epo.push(0);
				                        	rew_in_epo.push(0);
				                    	} else {
            						    	rew_in_epo.push(value.result[0].commission);
            						    	rew_in_epo.push(value.result[0].amount);
            						    	rew_in_epo.push(value.result[0].postBalance);
            					    	}
            					    	return rew_in_epo;
            					});
            					return it;
            				}
            				for (let i = 1; i < 11; i++)
            				{
            					rew.push(foo(i));
            				}
            				Promise.all(rew).then(values => { setCookie(vote_key, JSON.stringify(values), {'max-age': 259200} ); });
            				return rew;
				}
				
				if (typeof(getCookie(vote_key)) == "undefined") {
				            Promise.all(getrewards()).then(values => {showrew(values);});
				}
				else if ((epoch - 1) !== getCookie(vote_key, true)[0][0]) {
				            deleteCookie(vote_key);
                            Promise.all(getrewards()).then(values => {showrew(values);});
				} else {return showrew(getCookie(vote_key, true)); }
			})
			.catch(function(error)
			{
				console.error(error);
			});
		//---------------------------------------------------------------
		let cluster_slot = getrec(data_slot, url).then(function(value)
			{
				return value;
			})
			.catch(function(error)
			{
				console.log("Error get cluster_slot");
			});
		// let cl_ver = getrec(data_version, url).then(function(value)
		// 	{
		// 		return value;
		// 	})
		// 	.catch(function(error)
		// 	{
		// 		console.log("Error get cluster_slot");
		// 	});
		// let acc_ver = getrec(data_acc, url).then(function(value)
		// 	{
		// 		return value;
		// 	})
		// 	.catch(function(error)
		// 	{
		// 		console.log("Error get cluster_slot");
		// 	});
		let allt = getrec(data_next, url).then(function(value)
		{
			try
			{
				if (Object.keys(value.result) == 0)
				{
					return 0;
				}
				else
				{
					return value.result[key];
				}
			}
			catch (err)
			{
				if (value.error.code == "-32602")
				{
					alert("Pub-key is not valid");
					location.reload();
				}
			}
		}).catch(function(error)
		{
			console.error(error);
		});
		//---------------------------------------------------------------
		let bala = getrec(data_balance, url).then(function(value)
			{
				let bal = value.result.value;
				try
				{
					return (bal / 1000000000);
				}
				catch (err)
				{
					if (value.error.code == "-32602")
					{
						alert("Pub-key is not valid");
						location.reload();
					}
				}
			})
			.catch(function(error)
			{
				console.error(error);
			});
		//---------------------------------------------------------------
		let sdelal_blokov = getrec(data_BLOCKS_PRODUCTION_JSON, url).then(function(value)
			{
				let sdelal_bl;
				if (Object.keys(value["result"]["value"]["byIdentity"]) == 0)
				{
					sdelal_bl = 0;
				}
				else
				{
					sdelal_bl = value["result"]["value"]["byIdentity"][key][1];
				}
				return sdelal_bl;
			})
			.catch(function(error)
			{
				console.error(error);
			});
		//---------------------------------------------------------------
		Promise.all([time_const, cluster_slot, allt, sdelal_blokov, bala, rewards])
			.then(values =>
			{
				const [time_const_d, cluster_slot_d1, allt_d, sdelal_blokov_d, bala_d] = values;
				let cluster_slot_d = cluster_slot_d1.result.slotIndex;
				let end_slot_d = cluster_slot_d1.result.slotsInEpoch;
				let Done, will_done, skipped, skip, all;
				let next_slots = [];
				if (allt_d == 0) {
				    Done = 0;  will_done = 0; skipped = 0; all = 0; 
				} 
				else 
				{ 
				    all = allt_d.length;
				    
				    for (let i = 0; i < all; i++)
				    {
					    if (allt_d[i] >= cluster_slot_d)
					    {
						    next_slots.push(allt_d[i]);
					    }
				    }
				    will_done = next_slots.length;
				    Done = all - will_done;
				    if (Done == 0)
				    {
					    skipped = 0;
					    skip = 0;
				    }
				    else
				    {
					    skipped = Done - sdelal_blokov_d;
					    skip = Math.round((skipped * 100 / Done), 2);
				    }
				}
				let metrics = "<thead><tr><th>Metrics</th><th>Value</th></tr></thead><tbody><tr><td>Delinquent status</td><td id=del"+ vote_key + " class=" + del_status + "></td></tr><tr><td>Balance identity</td><td id=balance"+ vote_key + "></td></tr><tr><td>Activated Stake</td><td id=stake"+ vote_key + "></td></tr><tr><td>All blocks:</td><td id=all"+ vote_key + "></td></tr><tr><td>Done blocks:</td><td id=Done"+ vote_key + "></td></tr><tr><td>Will be done:</td><td id=will_done"+ vote_key + "></td></tr><tr><td>Skipped blocks:</td><td id=skipped"+ vote_key + "></td></tr><tr><td>Skip:</td><td id=skip"+ vote_key + "></td></tr></tbody>";
				writeHTML("info_tab" + vote_key, "table", "table", "metrics" + vote_key, metrics);
				document.getElementById("del"+ vote_key).innerHTML = del_status;
				document.getElementById("balance"+ vote_key).innerHTML = bala_d + " sol";
				document.getElementById("all"+ vote_key).innerHTML = all;
				document.getElementById("Done"+ vote_key).innerHTML = Done;
				document.getElementById("will_done"+ vote_key).innerHTML = will_done;
				document.getElementById("skipped"+ vote_key).innerHTML = skipped;
				document.getElementById("skip"+ vote_key).innerHTML = skip + " %";
				document.getElementById("stake"+ vote_key).innerHTML = stake + " sol";
				if (typeof(next_slots[0]) != "undefined" && all > Done)
				{
					let echo = [];
					let techo = [];
					let current_slot = next_slots[0];
					let left_slot = current_slot - cluster_slot_d;
					let secs = left_slot * time_const_d;
					let secs_slot = Date.now()+secs*1000;
					let normalDate = new Date(secs_slot).toLocaleString('ru-RU',{timeZone: timeZ});
					echo = echotime(secs);
					let echo_ = [];
					for (let c = 0; c < will_done; c++)
					{
						left_slot = next_slots[c] - current_slot;
						let secs1 = left_slot * time_const_d;
						if (secs1 >= 1)
						{
							echo_.push(echotime(secs1));
							secs_slot += secs1*1000;
							techo.push(secs_slot);
							
						}
						current_slot = next_slots[c];
					}
					let echo_count = echo_.length;
					let table = "";
					let id1, id2, id3, id4, id5;
					for (let d = 0; d < echo_count; d++)
					{
						id1 = vote_key + "t100" + d;
						id2 = vote_key + "t200" + d;
						id3 = vote_key + "t300" + d;
						id4 = vote_key + "t400" + d;
						id5 = vote_key + "t500" + d;
						let item = "<tr><td id=" + id5 + "></td><td id=" + id1 + "></td><td id=" + id2 + "></td><td id=" + id3 + "></td><td id=" + id4 + "></td></tr>";
						table += item;
					}
					let outtable1 = "<summary>Time to next:</summary><table class=table><thead><tr><th>Time to next:</th><th>Days</th><th>Hours</th><th>Minutes</th><th>Seconds</th></tr></thead><tbody><tr><td id=time"+ vote_key + "></td><td id=echod"+ vote_key + "></td><td id=echoh"+ vote_key + "></td><td id=echom"+ vote_key + "></td><td id=echos"+ vote_key + "></td></tr>";
					let endtab1 ="<tr><th id=tend" + vote_key + "></th><th id=eechod" + vote_key + "></th><th id=eechoh" + vote_key + "></th><th id=eechom" + vote_key + "></th><th id=eechos" + vote_key + "></th></tr></tbody></table>";
                    			let outtable = outtable1 + table + endtab1;
					writeHTML("info_tab"+ vote_key, "details", "link", "t" + vote_key, outtable);
					document.getElementById("echod"+ vote_key).innerHTML = echo[0];
					document.getElementById("echoh"+ vote_key).innerHTML = echo[1];
					document.getElementById("echom"+ vote_key).innerHTML = echo[2];
					document.getElementById("echos"+ vote_key).innerHTML = echo[3];
					document.getElementById("time"+ vote_key).innerHTML = normalDate;
					for (let d = 0; d < echo_count; d++)
					{
						id1 = vote_key + "t100" + d;
						id2 = vote_key + "t200" + d;
						id3 = vote_key + "t300" + d;
						id4 = vote_key + "t400" + d;
						id5 = vote_key + "t500" + d;
						document.getElementById(id1).innerHTML = echo_[d][0];
						document.getElementById(id2).innerHTML = echo_[d][1];
						document.getElementById(id3).innerHTML = echo_[d][2];
						document.getElementById(id4).innerHTML = echo_[d][3];
						document.getElementById(id5).innerHTML = new Date(techo[d]).toLocaleString('ru-RU',{timeZone: timeZ});
					}
					let echoe = [];
					let secs_end_epoh = (end_slot_d - cluster_slot_d) * time_const_d;
					echoe = echotime(secs_end_epoh);
					let secs_slot_end = Date.now()+secs_end_epoh*1000;
					let t_end =  new Date(secs_slot_end).toLocaleString('ru-RU',{timeZone: timeZ});
					document.getElementById("eechod" + vote_key).innerHTML = echoe[0];
					document.getElementById("eechoh" + vote_key).innerHTML = echoe[1];
					document.getElementById("eechom" + vote_key).innerHTML = echoe[2];
					document.getElementById("eechos" + vote_key).innerHTML = echoe[3];
					document.getElementById("tend" + vote_key).innerHTML = "End of epoch: " + t_end;
				}
				else
				{
					let echo = [];
					let secs_end_epoh = (end_slot_d - cluster_slot_d) * time_const_d;
					echo = echotime(secs_end_epoh);
					let secs_slot = Date.now()+secs_end_epoh*1000;
					let t_end =  new Date(secs_slot).toLocaleString('ru-RU',{timeZone: timeZ});
					writeHTML("info_tab" + vote_key, "table", "table", "end" + vote_key, "<thead><tr><th>All slots Done. Time until the end of the epoch:</th><th>Days</th><th>Hours</th><th>Minutes</th><th>Seconds</th></tr></thead><tbody><tr><td id=tend" + vote_key + "></td><td id=echod" + vote_key + "></td><td id=echoh" + vote_key + "></td><td id=echom" + vote_key + "></td><td id=echos" + vote_key + "></td></tr></tbody>");
					document.getElementById("echod" + vote_key).innerHTML = echo[0];
					document.getElementById("echoh" + vote_key).innerHTML = echo[1];
					document.getElementById("echom" + vote_key).innerHTML = echo[2];
					document.getElementById("echos" + vote_key).innerHTML = echo[3];
					document.getElementById("tend" + vote_key).innerHTML = t_end;
				}
			});
	});

   
}
