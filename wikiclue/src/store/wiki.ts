let contentUrl = 'https://en.wikipedia.org/w/api.php?action=query&origin=*&prop=revisions&rvprop=content&format=json&titles=';
let searchUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&origin=*&format=json&search=';

export async function getWikiPageContent(searchTerm: string) {
  // Check if the search term contains any non-space characters
  if (!/\S/.test(searchTerm)) {
    return false;
  }

  let url = contentUrl + searchTerm;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Found a page - return content
    if (data.query.pages && !data.query.pages[-1]) {
      let htmlContent = data.query.pages[Object.keys(data.query.pages)[0]].revisions[0]['*'];

      // This is to remove html content from api call
      let tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      let textContent = tempDiv.textContent || tempDiv.innerText || '';
      return textContent.replace(/\n/g, ' ').replace(/\s\s+/g, ' ').toLowerCase();
    }

    else {
      throw new Error('Page does not exist.');
    }
  }

  // Did not find a page - return null
  catch (error) {
    return null;
  }
}

export async function getWikiSearchResults(searchTerm: string) {
  // Search term is empty
  if (searchTerm.replace(/\s/g, '') === '') {
    return [];
  }

  // Search term is not empty
  else {
    let url = searchUrl + searchTerm;
    const response = await fetch(url);
    const data = await response.json();
    return data[1];;
  }
}
