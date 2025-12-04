#include <iostream>
using namespace std;

int main(){
    int arr[] = {7,1,5,6,4};

    // for(int i=0; i<4;i++){
    //     int index = i;
    //     for(int j=i+1;j<5;j++){
    //         if(arr[j]<arr[index]){
    //             index = j;
    //         }
    //     }
    //     swap(arr[index],arr[i]);
    // }

    // for(int i=0; i<5; i++){
    //     cout<<arr[i];
    // }

    bool swapped = 0;
    for(int i=4;i>=0;i--){
        for(int j=0;j<5;j++){
            if(arr[j]>arr[j+1]){
                swap(arr[j],arr[j+1]);
                swapped = 1 ;
            }
        }
    }

    if(swapped =1 ){
        cout<<"hello"<<endl;
    }

    for(int i=0;i<5;i++){
        cout<<arr[i]<<endl;
    }

    int key = 2 ;
    int start = 0;
    int end = 4;

    while(start <= end){
        int mid = (start + end)/2;
        if(arr[mid] = key){
            cout<<"found";
            break;
        }
        else if(arr[mid] < key){
            start++;
        }
        else end--;
    }



    return 0;
}