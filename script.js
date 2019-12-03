//this is my local js file
'use strict'

const apiKey ='CiK2beyF9KtVfbYNhawqvUlhX2sfrF21gMHuuVyT'
const searchURL ='https://developer.nps.gov/api/v1/parks'

function formatQParams(params) {
  console.log('`formatQParams` ran')
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&')
}

function displayResults(responseJson) {
  console.log('`displayResults` ran')
  console.log(responseJson)
  $('.results').empty()
  $('.js-error-msg').empty()
  for (let i=0; i < responseJson.data.length; i++) {
    if (responseJson.data.length === 0) {
        $('.results').append(`There are no National Parks in that state`)
    } else {
    $('.results').append(
      `<h3>${responseJson.data[i].fullName}</h3>
        <p>${responseJson.data[i].description}</p>
        <p><strong>Visit park page:</strong> <a href="${responseJson.data[i].url}" target="_blank">${responseJson.data[i].url}</a></p>`)

        for (let a = 0; a < (responseJson.data[i].addresses.length); a++) {
            if (responseJson.data[i].addresses[a].type === "Physical") {
              $('.results').append(
                `<p><em>Address:</em></p>
                <p>${responseJson.data[i].addresses[a].line1}</p>
                <p>${responseJson.data[i].addresses[a].line2}</p>
                <p>${responseJson.data[i].addresses[a].line3}</p>
                <p>${responseJson.data[i].addresses[a].city}, ${responseJson.data[i].addresses[a].stateCode}  ${responseJson.data[i].addresses[a].postalCode}</p><br>`)
              }
            }
          }
        }
      }

function getNatlParks(query, maxResults=10, addresses) {
  console.log('`getNatlParks` ran')
  const params = {
    stateCode: query,
    limit: maxResults,
    start: 1,
    api_key: apiKey,
    fields: "addresses"
  }
  const queryString = formatQParams(params)
  const url = searchURL + '?' + queryString
  console.log(url)
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json()
      }
      throw new Error(response.statusText)
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('.js-error-msg').append(`Something went wrong: ${err.message}`)
    })
  }


function handleSubmit() {
  console.log('`handleSubmit` ran')
  $('.js-submit-button').on('click', function(event)  {
    event.preventDefault()
    let maxResults = $('#js-max-results').val()
    console.log(maxResults)
    let statesArr = []
    if($("input[name='state']").is(":checked")) {
      $("input[name='state']:checked").each(function() {
        statesArr.push($(this).val())
      })
      console.log(statesArr)
    } else if($("input[name='state']").is(":not(:checked)")) {
      alert('You must select at least one state')
      return
    }
    getNatlParks(statesArr, maxResults)
    $('#parks-form')[0].reset()
  })
}

// Shorthand for $( document ).ready()
$(function() {
  console.log( "your app has loaded!" )
  handleSubmit()
})
