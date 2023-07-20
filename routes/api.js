const express = require('express')
const fs = require('fs')
const router = express.Router()

const locations = require('../assets/locations.json')

router.get('/api/population/state/:state/city/:city', async (req, res) => {
  try {
    let locale = await findLocation(req, res)
    locale = locale.shift()
    if(!locale){
      res.status(400).send('Location not found')
    } if(locale) {
      res.status(200).json({population: locale.Population})
    }
  } catch (err) {
    console.log(err)
    res.status(400).json( { error: err.message })
  }
})

router.put('/api/population/state/:state/city/:city', async (req, res) => {
  try {
    let isNew = false
    let message = 'Updated location population successfully'
    const pop = req.body.population
    let status = 200
    let locale = await findLocation(req, res)
    locale = locale.shift()
    if(!locale) {
      /* TODO: Capitalize first letter in city and state names before save */
      isNew = true
      locale = {
        'City': req.params.city,
        'State': req.params.state,
        'Population': pop
      }
    }
    locale.Population = pop
    if(isNew) {
      status = 201
      message = 'New location added successfully'
      locations.push(locale)
    }
    fs.writeFile('./assets/locations.json', JSON.stringify(locations), function (err) {
      if (err) throw err
    });
    res.status(status).json({
      population: locale.Population,
      message: message,
    })
  } catch (err) {
    console.log(err)
    res.status(400).json( { error: err.message })
  }
})

const findLocation = (req, res) => {
  const state = req.params.state.toLowerCase() || null
  const city = req.params.city.toLowerCase() || null
  if (!city || ! state) res.status(400).json('Please Include City and State')
  return locations.filter((i =>
      i['State'].toLowerCase() === state && i['City'].toLowerCase() === city
  ))
}

module.exports = router
