export const createApiParams = (zips: string[]) => {
    let url = ''
    zips.forEach(zip => url = url.concat('zip=' + zip + '&'))
    return url.substring(0,url.length-1);;
}