function datosJson(table, direccion, attLoy) {
    fetch(`https://api.propublica.org/congress/v1/113/${direccion}/members.json`, {
        headers: {
        'X-API-Key': 'n7zVdNKb0WhznGbExxM4MTgE9yFQRbR36IFfANSj' } })
        .then(respuesta => respuesta.json())
        .then(dato => {
            if (attLoy == 0) {
                // para tablas iniciales
                newTable(dato, table)
            } else if (attLoy == 1) {
                // para attendance
                tablesAttendance(dato, table)

            } else {
                // para loyalty
                tablesLoyalty(dato, table)
            }

        })
}

if (document.getElementById("tableSenate")) {
    const tableSenate = document.getElementById("tableSenate")
    datosJson(tableSenate, "senate", 0)
} else if (document.getElementById("tableHouse")) {
    const tableHouse = document.getElementById("tableHouse")
    datosJson(tableHouse, "house", 0)
} else if (document.getElementById("tableHouseAtt")) {
    const tableHouseAtt = document.getElementById("tableHouseAtt")
    datosJson(tableHouseAtt, "house", 1)
} else if (document.getElementById("tableSenateAtt")) {
    const tableSenateAtt = document.getElementById("tableSenateAtt")
    datosJson(tableSenateAtt, "senate", 1)
} else if (document.getElementById("tableHouseLoy")) {
    const tableHouseLoy = document.getElementById("tableHouseLoy")
    datosJson(tableHouseLoy, "house", 2)
} else {
    const tableSenateLoy = document.getElementById("tableSenateLoy")
    datosJson(tableSenateLoy, "senate", 2)
}


function newTable(chamber, table) {
    for (var i = 0; i < chamber.results[0].members.length; i++) {
        var fullNames = chamber.results[0].members[i].first_name + " " + (chamber.results[0].members[i].middle_name || "") + " " + chamber.results[0].members[i].last_name
        var party = chamber.results[0].members[i].party
        var state = chamber.results[0].members[i].state
        var years = chamber.results[0].members[i].seniority
        var votes = chamber.results[0].members[i].votes_with_party_pct
        var url = chamber.results[0].members[i].url

        var row = document.createElement("tr")
        var web = document.createElement("a")
        web.innerHTML = fullNames
        web.href = url
        var dataNames = document.createElement("td")
        var dataParty = document.createElement("td")
        var dataState = document.createElement("td")
        var dataYears = document.createElement("td")
        var dataVotes = document.createElement("td")


        dataParty.innerHTML = party
        dataState.innerHTML = state
        dataYears.innerHTML = years
        dataVotes.innerHTML = votes

        dataNames.append(web)
        row.appendChild(dataNames)
        row.appendChild(dataParty)
        row.appendChild(dataState)
        row.appendChild(dataYears)
        row.appendChild(dataVotes)

        table.appendChild(row)

    }
}

function tablesAttendance(chamber, table) {

    var statistics = []
    var cantDem = 0
    var cantRep = 0
    var cantInd = 0
    var votesPerDem = 0
    var votesPerRep = 0
    var votesPerInd = 0
    var leastAtten = []
    var mostAtten = []



    for (var i = 0; i < chamber.results[0].members.length; i++) {
        if (chamber.results[0].members[i].party == "D") {
            votesPerDem = votesPerDem + chamber.results[0].members[i].votes_with_party_pct
            cantDem++
        } else if (chamber.results[0].members[i].party == "R") {
            votesPerRep = votesPerRep + chamber.results[0].members[i].votes_with_party_pct
            cantRep++
        } else {
            votesPerInd = votesPerInd + chamber.results[0].members[i].votes_with_party_pct
            cantInd++
        }
    }

    var votesPerDem = votesPerDem / cantDem
    var votesPerRep = votesPerRep / cantRep
    var votesPerInd = votesPerInd / cantInd

    var total = cantDem + cantRep + cantInd
    var rowDem = document.getElementById("trDem")
    var rowRep = document.getElementById("trRep")
    var rowInd = document.getElementById("trInd")
    var rowTotal = document.getElementById("trTotal")
    var dataDem = document.createElement("td")
    var dataRep = document.createElement("td")
    var dataInd = document.createElement("td")
    var dataTotal = document.createElement("td")
    var dataVotesDem = document.createElement("td")
    var dataVotesRep = document.createElement("td")
    var dataVotesInd = document.createElement("td")
    var dataVotesTotal = document.createElement("td")


    dataDem.innerHTML = cantDem
    dataRep.innerHTML = cantRep
    dataInd.innerHTML = cantInd 
    dataTotal.innerHTML = total
    dataVotesDem.innerHTML = votesPerDem.toFixed(2) + "%"
    dataVotesRep.innerHTML = votesPerRep.toFixed(2) + "%"
    dataVotesInd.innerHTML = votesPerInd.toFixed(2) ||  "0"
    dataVotesTotal.innerHTML = ""

    rowDem.append(dataDem, dataVotesDem)
    rowRep.append(dataRep, dataVotesRep)
    rowInd.append(dataInd, dataVotesInd)
    rowTotal.append(dataTotal, dataVotesTotal)

    // Creo las tablas de asistencia
    // least attendance
    var leastAtt = chamber.results[0].members.slice()
    var leastAttendance = leastAtt.filter(leastAtt => leastAtt.total_votes !== 0)
    leastAttendance.sort((a, b) => a.missed_votes_pct - b.missed_votes_pct)

    leastAttendance.length
    leastAttendancePer = (leastAttendance.length * 10) / 100
    leastAttendancePerc = Math.floor(leastAttendancePer)
    leastAtten = leastAttendance.slice(0, leastAttendancePerc)

    for (var i = 0; i < leastAtten.length; i++) {

        var fullName = leastAtten[i].first_name + " " + (leastAtten[i].middle_name || "") + " " + leastAtten[i].last_name
        var votesPerc = (leastAtten[i].votes_with_party_pct * leastAtten[i].total_votes) / 100
        var partyVotes = votesPerc.toFixed(0)
        var votesPercent = leastAtten[i].votes_with_party_pct

        var tableBody = document.getElementById("leastEng")
        var row = document.createElement("tr")
        var dataName = document.createElement("td")
        var dataVotes = document.createElement("td")
        var dataVotesParty = document.createElement("td")

        dataName.innerHTML = fullName
        dataVotes.innerHTML = partyVotes
        dataVotesParty.innerHTML = votesPercent+"%"

        row.appendChild(dataName)
        row.appendChild(dataVotes)
        row.appendChild(dataVotesParty)
        tableBody.appendChild(row)


    }


    // top attendance

    var mostAtt = chamber.results[0].members.slice()
    var mostAttendance = mostAtt.filter(mostAtt => mostAtt.total_votes !== 0)
    mostAttendance.sort((a, b) => b.missed_votes_pct - a.missed_votes_pct)

    mostAttendance.length
    mostAttendancePer = (mostAttendance.length * 10) / 100
    mostAttendancePerc = Math.floor(mostAttendancePer)
    mostAtten = mostAttendance.slice(0, mostAttendancePerc)

    for (var i = 0; i < mostAtten.length; i++) {

        var fullName = mostAtten[i].first_name + " " + (mostAtten[i].middle_name || "") + " " + mostAtten[i].last_name
        var votesPerc = (mostAtten[i].votes_with_party_pct * mostAtten[i].total_votes) / 100
        var partyVotes = votesPerc.toFixed(0)
        var votesPercent = mostAtten[i].votes_with_party_pct

        var tableBody = document.getElementById("mostEng")
        var row = document.createElement("tr")
        var dataName = document.createElement("td")
        var dataVotes = document.createElement("td")
        var dataVotesParty = document.createElement("td")

        dataName.innerHTML = fullName
        dataVotes.innerHTML = partyVotes
        dataVotesParty.innerHTML = votesPercent+"%"

        row.appendChild(dataName)
        row.appendChild(dataVotes)
        row.appendChild(dataVotesParty)
        tableBody.appendChild(row)


    }



}


function tablesLoyalty(chamber, table) {

    var cantDem = 0
    var cantRep = 0
    var cantInd = 0
    var votesPerDem = 0
    var votesPerRep = 0
    var votesPerInd = 0
    var missedVotes = 0
    var missedVotesPerc = 0
    var leastLoyalty = []
    var mostLoyalty = []


    for (var i = 0; i < chamber.results[0].members.length; i++) {
        if (chamber.results[0].members[i].party == "D") {
            votesPerDem = votesPerDem + chamber.results[0].members[i].votes_with_party_pct
            cantDem++
        } else if (chamber.results[0].members[i].party == "R") {
            votesPerRep = votesPerRep + chamber.results[0].members[i].votes_with_party_pct
            cantRep++
        } else {
            votesPerInd = votesPerInd + chamber.results[0].members[i].votes_with_party_pct
            cantInd++
        }
    }

    var votesPerDem = votesPerDem / cantDem
    var votesPerRep = votesPerRep / cantRep
    var votesPerInd = votesPerInd / cantInd

    var total = cantDem + cantRep + cantInd
    var rowDem = document.getElementById("trDem")
    var rowRep = document.getElementById("trRep")
    var rowInd = document.getElementById("trInd")
    var rowTotal = document.getElementById("trTotal")
    var dataDem = document.createElement("td")
    var dataRep = document.createElement("td")
    var dataInd = document.createElement("td")
    var dataTotal = document.createElement("td")
    var dataVotesDem = document.createElement("td")
    var dataVotesRep = document.createElement("td")
    var dataVotesInd = document.createElement("td")
    var dataVotesTotal = document.createElement("td")


    dataDem.innerHTML = cantDem
    dataRep.innerHTML = cantRep
    dataInd.innerHTML = cantInd
    dataTotal.innerHTML = total
    dataVotesDem.innerHTML = votesPerDem.toFixed(2) + "%"
    dataVotesRep.innerHTML = votesPerRep.toFixed(2) + "%"
    dataVotesInd.innerHTML = votesPerInd.toFixed(2)
    dataVotesTotal.innerHTML = ""

    rowDem.append(dataDem, dataVotesDem)
    rowRep.append(dataRep, dataVotesRep)
    rowInd.append(dataInd, dataVotesInd)
    rowTotal.append(dataTotal, dataVotesTotal)

    // Creo las tablas de lealtad
    // least loyalty
    var leastLoy = chamber.results[0].members.slice()
    var leastLoyal = leastLoy.filter(leastLoy => leastLoy.total_votes !== 0)
    leastLoyal.sort((a, b) => a.votes_with_party_pct - b.votes_with_party_pct)

    leastLoyal.length
    leastLoyalPer = (leastLoyal.length * 10) / 100
    leastLoyalPerc = Math.floor(leastLoyalPer)
    leastLoyalty = leastLoyal.slice(0, leastLoyalPerc)

    for (var i = 0; i < leastLoyalty.length; i++) {

        var fullName = leastLoyalty[i].first_name + " " + (leastLoyalty[i].middle_name || "") + " " + leastLoyalty[i].last_name
        var votesPerc = (leastLoyalty[i].votes_with_party_pct * leastLoyalty[i].total_votes) / 100
        var partyVotes = votesPerc.toFixed(0)
        var votesPercent = leastLoyalty[i].votes_with_party_pct

        var tableBody = document.getElementById("leastLoyal")
        var row = document.createElement("tr")
        var dataName = document.createElement("td")
        var dataVotes = document.createElement("td")
        var dataVotesParty = document.createElement("td")

        dataName.innerHTML = fullName
        dataVotes.innerHTML = partyVotes
        dataVotesParty.innerHTML = votesPercent+"%"

        row.appendChild(dataName)
        row.appendChild(dataVotes)
        row.appendChild(dataVotesParty)
        tableBody.appendChild(row)


    }

    //top loyalty
    var mostLoy = chamber.results[0].members.slice()
    var mostLoyal = mostLoy.filter(mostLoy => mostLoy.total_votes !== 0)
    mostLoyal.sort((a, b) => b.votes_with_party_pct - a.votes_with_party_pct)

    mostLoyal.length
    mostLoyalPer = (mostLoyal.length * 10) / 100
    mostLoyalPerc = Math.floor(mostLoyalPer)
    mostLoyalty = mostLoyal.slice(0, mostLoyalPerc)

    console.log(mostLoyalty)

    for (var i = 0; i < mostLoyalty.length; i++) {

        var fullName = mostLoyalty[i].first_name + " " + (mostLoyalty[i].middle_name || "") + " " + mostLoyalty[i].last_name
        var votesPerc = (mostLoyalty[i].votes_with_party_pct * mostLoyalty[i].total_votes) / 100
        var partyVotes = votesPerc.toFixed(0)
        var votesPercent = mostLoyalty[i].votes_with_party_pct

        var tableBody = document.getElementById("mostLoyal")
        var row = document.createElement("tr")
        var dataName = document.createElement("td")
        var dataVotes = document.createElement("td")
        var dataVotesParty = document.createElement("td")

        dataName.innerHTML = fullName
        dataVotes.innerHTML = partyVotes
        dataVotesParty.innerHTML = votesPercent+"%"

        row.appendChild(dataName)
        row.appendChild(dataVotes)
        row.appendChild(dataVotesParty)
        tableBody.appendChild(row)


    }


}