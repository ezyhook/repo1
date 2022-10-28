let _radio1 = document.getElementById('radio-1');
_radio1.addEventListener("change", () =>
{
	checkValidity(document.getElementById("key").value.replace(/\s/g, ""));
});
let _radio2 = document.getElementById('radio-2');
_radio2.addEventListener("change", () =>
{
	checkValidity(document.getElementById("key").value.replace(/\s/g, ""));
});
let _input = document.getElementById('key');
_input.addEventListener("change", () =>
{
	checkValidity(document.getElementById("key").value.replace(/\s/g, ""));
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
document.write = function(s)
	{
		let scripts = document.getElementsByTagName('script');
		let lastScript = scripts[scripts.length - 1];
		lastScript.insertAdjacentHTML("beforebegin", s);
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
		let data_voteinfo = '{"jsonrpc":"2.0", "id": 1, "method":"getVoteAccounts", "params": [{"votePubkey":"' + val_key + '"}]}';
		getrec(data_voteinfo, val_url)
			.then(function(value)
			{
				let pubkey;
				if (typeof(value["result"]["current"][0]) == "undefined")
				{
					pubkey = value["result"]["delinquent"][0]["nodePubkey"].length;
				}
				else if (typeof(value["result"]["delinquent"][0]) == "undefined")
				{
					pubkey = value["result"]["current"][0]["nodePubkey"].length;
				}
				try
				{
					if (pubkey > 0)
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
		val_url = "https://api.mainnet-beta.solana.com";
		//val_url = "https://quaint-frequent-smoke.solana-mainnet.discover.quiknode.pro/c62fc1839a7f9a8e955f3f5783b7de773dca4b72/";
	}
	let val_key = document.getElementById("key").value.replace(/\s/g, "");
	showinfo(val_url, val_key);
}
//---------------------------------------------------------------
function showinfo(url, vote_key)
{
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
			stake = value["result"]["current"][0]["activatedStake"]/1000000000;
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
							let item1 = "<tr><td id=r1_" + g + "></td><td id=r2_" + g + "></td><td id=r3_" + g + "></td><td id=r4_" + g + "></td></tr>";
							table1 += item1;
						}
						let outtable1 = "<table class=table><thead><th>Epoch</th><th>Commission</th><th>Rewards</th><th>Balance</th></tr></thead><tbody>" + table1 + "<th></th><th>Total:</th><th id=sumrew></th><th></th></tr></tbody></table>";
						document.write(outtable1);
						sum_rew = 0;
						for (let g = 0; g < 10; g++)
						{
							let ir1 = "r1_" + g;
							let ir2 = "r2_" + g;
							let ir3 = "r3_" + g;
							let ir4 = "r4_" + g;
							document.getElementById(ir1).innerText = values[g][0];
							document.getElementById(ir2).innerText = values[g][1];
							document.getElementById(ir3).innerText = values[g][2] / 1000000000;
							document.getElementById(ir4).innerText = values[g][3] / 1000000000;
							sum_rew += values[g][2] / 1000000000;
						}
						document.getElementById("sumrew").innerText = sum_rew;
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
            						rew_in_epo.push(value.result[0].epoch);
            						rew_in_epo.push(value.result[0].commission);
            						rew_in_epo.push(value.result[0].amount);
            						rew_in_epo.push(value.result[0].postBalance);
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
				} else {console.log("Good way"); return showrew(getCookie(vote_key, true)); }
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
				if (Object.keys(value.result).length === 0)
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
				let metrics = "<table class=table><thead><tr><th>Metrics</th><th>Value</th></tr></thead><tbody><tr><td>Delinquent status</td><td id=del class=" + del_status + "></td></tr><tr><td>Balance identity</td><td id=balance></td></tr><tr><td>Activated Stake</td><td id=stake></td></tr><tr><td>All blocks:</td><td id=all></td></tr><tr><td>Done blocks:</td><td id=Done></td></tr><tr><td>Will be done:</td><td id=will_done></td></tr><tr><td>Skipped blocks:</td><td id=skipped></td></tr><tr><td>Skip:</td><td id=skip></td></tr></tbody></table>";
				document.write(metrics);
				document.getElementById("del").innerText = del_status;
				document.getElementById("balance").innerText = bala_d + " sol";
				document.getElementById("all").innerText = all;
				document.getElementById("Done").innerText = Done;
				document.getElementById("will_done").innerText = will_done;
				document.getElementById("skipped").innerText = skipped;
				document.getElementById("skip").innerText = skip + " %";
				document.getElementById("stake").innerText = stake + " sol";

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
						id1 = "t100" + d;
						id2 = "t200" + d;
						id3 = "t300" + d;
						id4 = "t400" + d;
						id5 = "t500" + d;
						let item = "<tr><td id=" + id5 + "></td><td id=" + id1 + "></td><td id=" + id2 + "></td><td id=" + id3 + "></td><td id=" + id4 + "></td></tr>";
						table += item;
					}
					let outtable = "<details class=link><summary>Time to next block:</summary><table class=table><thead><tr><th>Time to next:</th><th>Days</th><th>Hours</th><th>Minutes</th><th>Seconds</th></tr></thead><tbody><tr><td id=time></td><td id=echod></td><td id=echoh></td><td id=echom></td><td id=echos></td></tr>" + table + "</tbody></table></details>";
					document.write(outtable);
					document.getElementById("echod").innerText = echo[0];
					document.getElementById("echoh").innerText = echo[1];
					document.getElementById("echom").innerText = echo[2];
					document.getElementById("echos").innerText = echo[3];
					document.getElementById("time").innerText = normalDate;
					for (let d = 0; d < echo_count; d++)
					{
						id1 = "t100" + d;
						id2 = "t200" + d;
						id3 = "t300" + d;
						id4 = "t400" + d;
						id5 = "t500" + d;
						document.getElementById(id1).innerText = echo_[d][0];
						document.getElementById(id2).innerText = echo_[d][1];
						document.getElementById(id3).innerText = echo_[d][2];
						document.getElementById(id4).innerText = echo_[d][3];
						document.getElementById(id5).innerText = new Date(techo[d]).toLocaleString('ru-RU',{timeZone: timeZ});
					}
				}
				else
				{
					let echo = [];
					let secs_end_epoh = (end_slot_d - cluster_slot_d) * time_const_d;
					echo = echotime(secs_end_epoh);
					let t_end =  new Date(secs_end_epoh*1000).toLocaleString('ru-RU',{timeZone: timeZ});
					document.write("<table class=table><thead><tr><th>All slots Done. Time until the end of the epoch:</th><th>Days</th><th>Hours</th><th>Minutes</th><th>Seconds</th></tr></thead><tbody><tr><td id=tend></td><td id=echod></td><td id=echoh></td><td id=echom></td><td id=echos></td></tr></tbody></table>");
					document.getElementById("echod").innerText = echo[0];
					document.getElementById("echoh").innerText = echo[1];
					document.getElementById("echom").innerText = echo[2];
					document.getElementById("echos").innerText = echo[3];
					document.getElementById("tend").innerText = t_end;
				}
			});
	});
}
