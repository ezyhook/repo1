let _radio1 = document.getElementById('radio-1');
_radio1.addEventListener("change", () =>
{
	checkValidity(document.getElementById("key").value);
});
let _radio2 = document.getElementById('radio-2');
_radio2.addEventListener("change", () =>
{
	checkValidity(document.getElementById("key").value);
});
let _input = document.getElementById('key');
_input.addEventListener("change", () =>
{
	checkValidity(document.getElementById("key").value);
});
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
document.write = function(s)
	{
		let scripts = document.getElementsByTagName('script');
		let lastScript = scripts[scripts.length - 1];
		lastScript.insertAdjacentHTML("beforebegin", s);
	};
let docwrite = function(doc) 
    {               
    document.write(doc);
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
function checkValidity(val_key)
{
	const radio1 = document.getElementById('radio-1');
	const radio2 = document.getElementById('radio-2');
	const input = document.getElementById('key');

	if (val_key === "")
	{
		input.nextElementSibling.textContent = 'Input is empty';
	}
	else
	{
		let val_url;
		if (radio1.checked)
		{
			val_url = "https://api.testnet.solana.com";
		}
		else if (radio2.checked)
		{
			val_url = "https://api.mainnet-beta.solana.com";
		}
		let data_voteinfo = '{"jsonrpc":"2.0", "id": 1, "method":"getVoteAccounts", "params": [{"votePubkey":"' + val_key +'"}]}';
    getrec(data_voteinfo, val_url)
			.then(function(value)
			{   
			    let pubkey;
			    if(typeof(value["result"]["current"][0]) == "undefined"){
			        pubkey = value["result"]["delinquent"][0]["nodePubkey"].length;
			    }
			    else if (typeof(value["result"]["delinquent"][0]) == "undefined") {
				    pubkey = value["result"]["current"][0]["nodePubkey"].length;
			    }
				try
				{
					if (pubkey > 0 )
					{
						input.classList.remove('text-field__input_invalid');
						input.classList.add('text-field__input_valid');
						input.nextElementSibling.textContent = 'Valid';
						sendForm();
					} 
					/**else
					{
						input.classList.remove('text-field__input_valid');
						input.classList.add('text-field__input_invalid');
						input.nextElementSibling.textContent = 'Not valid';
					}*/
				}
				catch (err)
				{
					if (value.error.code == "-32602")
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
				alert("Pub-key is not valid");
				location.reload();
			});
	}
}
//---------------------------------------------------------------
function sendForm()
{
	let val_url;
	if (document.getElementById('radio-1').checked)
	{
		//val_url = "https://api.testnet.solana.com";
		val_url = "https://fittest-serene-liquid.solana-testnet.discover.quiknode.pro/f3e2b1ac3303a0b16938af9fe8985c15310c02e8/";
	}
	else if (document.getElementById('radio-2').checked)
	{
		//val_url = "https://api.mainnet-beta.solana.com";
		val_url = "https://quaint-frequent-smoke.solana-mainnet.discover.quiknode.pro/c62fc1839a7f9a8e955f3f5783b7de773dca4b72/";
	}
	let val_key = document.getElementById("key").value;
	showinfo(val_url, val_key);
}
//---------------------------------------------------------------
function showinfo(url, vote_key)
{
let data_voteinfo = '{"jsonrpc": "2.0", "id": 1, "method": "getVoteAccounts", "params": [{"votePubkey": "' + vote_key +'"}]}';
getrec(data_voteinfo, url).then(function(value) {
    let key;
    let del_status;
    if (value["result"]["current"].length != 0) {
        key = value["result"]["current"][0]["nodePubkey"];
        del_status = false;
    } else if (value["result"]["delinquent"].length != 0) {
        key = value["result"]["delinquent"][0]["nodePubkey"];
        del_status = true;
    }
	const params_t = 5;
	let data_slot = '{"jsonrpc":"2.0","id":1,"method":"getEpochInfo"}';
	let data_next = '{"jsonrpc":"2.0", "id":1, "method":"getLeaderSchedule", "params":[{"identity":"' + key + '"}]}';
	let data_BLOCKS_PRODUCTION_JSON = '{"jsonrpc":"2.0","id":1, "method":"getBlockProduction", "params": [{ "identity": "' + key + '" }]}';
	let data_time = '{"jsonrpc":"2.0", "id":1, "method":"getRecentPerformanceSamples", "params": [' + params_t + ']}';
	let data_balance = '{"jsonrpc":"2.0", "id":1, "method":"getBalance", "params": ["' + key + '"]}';
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
			console.log("Error get data_time");
		});
	//---------------------------------------------------------------
	let rewards = getrec(data_slot, url).then(function(value)
		{
			let epoch = value.result.epoch;
			let rew = [];
			function foo(index) {
			  let cu_epoch = epoch - index;
			  let data_reward =  '{"jsonrpc": "2.0", "id": 1, "method": "getInflationReward", "params": [["' + vote_key +'"], {"epoch": ' + cu_epoch + '}]}';
			  let rew_in_epo = [];
			  return getrec(data_reward, url).then(function(value)
		      { 
		          //setTimeout(() => {console.log("Delayed for 0.5 sec.");}, 500);
		          rew_in_epo.push(value.result[0].epoch);
		          rew_in_epo.push(value.result[0].commission);
		          rew_in_epo.push(value.result[0].amount);
		          rew_in_epo.push(value.result[0].postBalance);
		          return rew_in_epo;
		      });
			}
			for (let i = 1; i < 11; i++) {
			    rew.push(foo(i));
			}
			return rew;
		})
		.catch(function(error)
		{
			console.log("Error get cluster_slot");
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
	let allt = getrec(data_next, url).then(function(value)
	{
		try
		{
			if (Object.keys(value.result).length === 0)
			{
				alert("Pub-key is not vailed");
				location.reload();
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
		console.log("Error get All_slots");
	});
	//---------------------------------------------------------------
	let bala = getrec(data_balance, url).then(function(value)
		{
			let bal = value.result.value;
			try
			{
				if (bal > 0)
				{
					return (bal / 1000000000);
				}
				else
				{
					alert("Pub-key is not valid");
					location.reload();
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
		})
		.catch(function(error)
		{
			console.log("Error get Balance");
		});
	//---------------------------------------------------------------
	let sdelal_blokov = getrec(data_BLOCKS_PRODUCTION_JSON, url).then(function(value)
		{
			let sdelal_bl;
			if (typeof(value["result"]["value"]["byIdentity"][key][1]) == "undefined")
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
			console.log("Error get sdelal_blokov");
		});
	//---------------------------------------------------------------
	Promise.all([time_const, cluster_slot, allt, sdelal_blokov, bala, rewards])
		.then(values =>
		{
			const [time_const_d, cluster_slot_d1, allt_d, sdelal_blokov_d, bala_d, rewards_d] = values;
			Promise.all(rewards_d)
			  .then(values => 
			  {
      		  	let table1 = "";
      		  	for (let g = 0; g < 10; g++) {
      		  			let item1 = "<tr><td id=r1_" + g + "></td><td id=r2_" + g + "></td><td id=r3_" + g + "></td><td id=r4_" + g + "></td></tr>";
      		  			table1 += item1;
      	  	  }
      	  	  let outtable1 = "<table class=table><thead><th>Epoch</th><th>Commission</th><th>Rewards</th><th>Balance</th></tr></thead><tbody>" + table1 + "<th></th><th>Total:</th><th id=sumrew></th><th></th></tr></tbody></table>";
      		  	docwrite(outtable1);
      		  	sum_rew = 0;
      		  	for (let g = 0; g < 10; g++) {
                  let ir1 = "r1_" + g;
                  let ir2 = "r2_" + g;
                  let ir3 = "r3_" + g;
      		  		  let ir4 = "r4_" + g;
      	  			  document.getElementById(ir1).innerText = values[g][0];
      				  document.getElementById(ir2).innerText = values[g][1];
      			  	  document.getElementById(ir3).innerText = values[g][2]/1000000000;
      			  	  document.getElementById(ir4).innerText = values[g][3]/1000000000;
      			  	  sum_rew += values[g][2]/1000000000;
      			  }
      			  document.getElementById("sumrew").innerText =sum_rew;
      			});

			let cluster_slot_d = cluster_slot_d1.result.slotIndex;
			let end_slot_d = cluster_slot_d1.result.slotsInEpoch;
			let all = allt_d.length;
			let next_slots = [];
			for (let i = 0; i < all; i++)
			{
				if (allt_d[i] >= cluster_slot_d)
				{
					next_slots.push(allt_d[i]);
				}
			}
			let will_done = next_slots.length;
			let Done = all - will_done;
			let skipped;
			let skip;
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
			docwrite("<table class=table><thead><tr><th>Metrics</th><th>Value</th></tr></thead><tbody><tr><td>Delinquent status</td><td id=del></td></tr><tr><td>Balance identity</td><td id=balance></td></tr><tr><td>All blocks:</td><td id=all></td></tr><tr><td>Done blocks:</td><td id=Done></td></tr><tr><td>Will be done:</td><td id=will_done></td></tr><tr><td>Skipped blocks:</td><td id=skipped></td></tr><tr><td>Skip:</td><td id=skip></td></tr></tbody></table>");
			document.getElementById("del").innerText = del_status;
			document.getElementById("balance").innerText = bala_d + " sol";
			document.getElementById("all").innerText = all;
			document.getElementById("Done").innerText = Done;
			document.getElementById("will_done").innerText = will_done;
			document.getElementById("skipped").innerText = skipped;
			document.getElementById("skip").innerText = skip + " %";
			
			if (typeof(next_slots[0]) != "undefined" && all > Done)
			{
			  let echo = [];
				let current_slot = next_slots[0];
				let left_slot = current_slot - cluster_slot_d;
				let secs = left_slot * time_const_d;
				echo=echotime(secs);

				let echo_ = [];
				for (let c = 0; c < will_done; c++)
				{
					left_slot = next_slots[c] - current_slot;
					let secs1 = left_slot * time_const_d;
					if (secs1 >= 1)
					{
						echo_.push(echotime(secs1));
					}
					current_slot = next_slots[c];
				}
				let echo_count = echo_.length;
				let table = "";
				for (let d = 0; d < echo_count; d++)
				{
					let id1 = "t100" + d;
					let id2 = "t200" + d;
					let id3 = "t300" + d;
					let id4 = "t400" + d;
					let item = "<tr><td></td><td id=" + id1 + "></td><td id=" + id2 + "></td><td id=" + id3 + "></td><td id=" + id4 + "></td></tr>";
					table += item;
				}
				let outtable = "<details class=link><summary>Time to next:</summary><table class=table><thead><tr><th>Time to next:</th><th>Days</th><th>Hours</th><th>Minutes</th><th>Seconds</th></tr></thead><tbody><tr><td></td><td id=echod></td><td id=echoh></td><td id=echom></td><td id=echos></td></tr>" + table + "</tbody></table></details>";
				docwrite(outtable);
				document.getElementById("echod").innerText = echo[0];
				document.getElementById("echoh").innerText = echo[1];
				document.getElementById("echom").innerText = echo[2];
				document.getElementById("echos").innerText = echo[3];				
				for (let d = 0; d < echo_count; d++)
				{
				  let id1 = "t100" + d;
					let id2 = "t200" + d;
					let id3 = "t300" + d;
					let id4 = "t400" + d;
				  document.getElementById(id1).innerText = echo_[d][0];
					document.getElementById(id2).innerText = echo_[d][1];
					document.getElementById(id3).innerText = echo_[d][2];
					document.getElementById(id4).innerText = echo_[d][3];
				}
			}
			else
			{
			  let echo = [];
			  docwrite("<table class=table><thead><tr><th>All slots Done. Time until the end of the epoch:</th><th>Days</th><th>Hours</th><th>Minutes</th><th>Seconds</th></tr></thead><tbody><tr><td></td><td id=echod></td><td id=echoh></td><td id=echom></td><td id=echos></td></tr></tbody></table>");
				let secs_end_epoh = (end_slot_d - cluster_slot_d) * time_const_d;
				echo = echotime(secs_end_epoh);
				document.getElementById("echod").innerText = echo[0];
				document.getElementById("echoh").innerText = echo[1];
				document.getElementById("echom").innerText = echo[2];
				document.getElementById("echos").innerText = echo[3];
			}
		});
});		
}
