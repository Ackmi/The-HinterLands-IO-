export class MathHelpers
{
    /*
    Round to 2 decimal places
    */
    static Round(num:number):number
    {
        return (Math.round(num*100)/100);
    }
}