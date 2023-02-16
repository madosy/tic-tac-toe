function countContent(myArray, marker) {
    finalcount = myArray.reduce((accumulator, currentValue, currentIndex) => {
        if currentIndex == 0 {
            accumulator.row1++;
            accumulator.col1++;
            accumulator.cor1++;
        }
        return accumulator
    },{row1,row2,row3,col1,col2,col3,cor1,cor2})
}
