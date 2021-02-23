window.addEventListener('DOMContentLoaded', async function(event) {
    let db = firebase.firestore()
    let apiKey = '030138f66d4cf0fb6dc745580f67503a'
    let response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US`)
    let json = await response.json()
    let movies = json.results
    console.log(movies)
    
     firebase.auth().onAuthStateChanged(async function(user) {
         if (user) {
          // Signed in
          console.log('signed in')

          db.collection('users').doc(user.uid).set({
            name: user.displayName,
            email: user.email
          })
        
          document.querySelector('.sign-in-or-sign-out').innerHTML = `
          <button class="text-pink-500 underline font-bold sign-out">Sign Out</button>`
        document.querySelector('.sign-out').addEventListener('click', function(event) {
          console.log('sign out clicked')
          firebase.auth().signOut()
          document.location.href = 'movies.html'
        })

    
    let docRef = await db.collection('users').add({ 
        username: user.displayName,
        useremail: user.email 
        
      })
      let userId = docRef.id

    for (let i=0; i<movies.length; i++) {
      let movie = movies[i]
      let movieID = movies[i].id
      let docRef = await db.collection('watched').doc(`${movieID}`).get()
      let watchedMovie = docRef.data()
      let opacityClass = ''
      if (watchedMovie) {
        let querySnapshot = await db.collection('watched')
        .where('movieID', '==', movieID)
        .get()
        opacityClass = 'opacity-20'
      }
  
      document.querySelector('.movies').insertAdjacentHTML('beforeend', `
        <div class="w-1/5 p-4 movie-${movieID} ${opacityClass}">
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="w-full">
          <a href="#" class="watched-button block text-center text-white bg-green-500 mt-4 px-4 py-2 rounded">I've watched this!</a>
        </div>
      `)
  
      document.querySelector(`.movie-${movieID}`).addEventListener('click', async function(event) {
        event.preventDefault()
        console.log (`I have watched ${movieID}`)

        let querySnapshot = await db.collection('watched')
                             .where('movieID', '==', movieID)
                             .where('userId', '==', firebase.auth().currentUser.uid)
                             .get()
        
        
        await db.collection('watched').add({
          movieID: movieID,
          userId: firebase.auth().currentUser.uid

        })

          if (querySnapshot.size == 0) {
        
            document.querySelector(`.movies-${moviesId}`).classList.add('opacity-20')
            await db.collection('watched').doc(`${movieID}`).set({})

          }
        
        

      }) 

    
    
    }
} 
 
else {

    console.log('signed out')
    
     let ui = new firebaseui.auth.AuthUI(firebase.auth())

    // FirebaseUI configuration
    let authUIConfig = {
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      signInSuccessUrl: 'movies.html'
    }

    // Starts FirebaseUI Auth
    ui.start('.sign-in-or-sign-out', authUIConfig)
  }

})

})
