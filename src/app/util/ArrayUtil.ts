export class ArrayUtil {

    static rotate(arr: Array<any>, n: number) {
        return arr.slice(n, arr.length).concat(arr.slice(0, n));
    }
}
