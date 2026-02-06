---
title: 배열
slug: java-array
created: 2025-03-31 14:21
updated:
description:
category: java
tags:
published: true
---

## 자바 배열 특징

- 배열은 `java.lang.Object`를 상속받는 객체이다.
- 힙 메모리 영역에 생성된다.
- 배열의 길이는 `length` 필드로 접근한다. (메서드 아님)
- 가변 길이 다차원 배열을 지원한다.
- 배열을 다루는 유용한 메서드는 `java.util.Arrays`에 있다.

## 배열 선언

```java
int[] array;

int array[];
```

두 방식 모두 가능하지만 1번(`type[] var`)이 자바에서 더 권장된다.

## 배열 생성 및 초기화

```java
// 1
int[] arr;
arr = new int[5];

// 2
int[] arr = new int[5];

// 3
int[] arr = new int[]{1, 2, 3, 4, 5};
int[] arr = {1, 2, 3, 4, 5}; // new int[] 생략 가능

// 다차원 배열
int[][] arr = new int[3][4];

int[][] arr = {
  {1, 2, 3, 4},
  {5, 6, 7, 8},
  {9, 10, 11, 12}
}

// 가변 길이 다차원 배열
int[][] arr = new int[3][];
arr[0] = new int[2];
arr[1] = new int[3];
arr[2] = new int[4];

int[][] arr = {
  {1, 2},
  {3, 4, 5},
  {6, 7, 8, 9}
}
```

## 배열의 기본값

빈 배열을 생성하면 각 요소는 해당 타입의 기본값으로 초기화된다.

- `int`, `long`, `short`, `byte`: 0
- `double`, `float`: 0.0
- `char`: '\u0000' (null 문자)
- `boolean`: false
- 참조 타입(클래스, 인터페이스, 배열 등): null

## 배열의 길이

`length` 필드로 접근할 수 있다.
주의할 점은 `length`는 메서드가 아니라 `final`로 선언된 필드이므로 괄호를 사용하지 않는다.

## 배열 관련 유용한 메서드(`java.util.Arrays`)

### `java.util.Arrays` 외에

- `System.arraycopy()`: 배열 복사
- `array.clone()`: 배열 자체에 존재하는 메서드(shallow copy)

### 정렬 관련

- `sort(array)`: 배열 전체를 오름차순으로 정렬
- `sort(array, fromIndex, toIndex)`: 배열의 일부분만 정렬
- `sort(array, Comparator)`: 지정된 비교자로 정렬 (객체 배열용)
- `parallelSort(array)`: 병렬 알고리즘을 사용한 정렬
- `parallelSort(array, fromIndex, toIndex)`: 배열 일부분을 병렬 정렬
- `parallelSort(array, Comparator)`: 병렬 정렬 + 비교자 사용

### 검색 관련

- `binarySearch(array, key)`: 정렬된 배열에서 이진 검색으로 키 검색
- `binarySearch(array, fromIndex, toIndex, key)`: 정렬된 배열의 일부에서 검색
- `binarySearch(array, key, Comparator)`: 비교자를 사용한 이진 검색

### 배열 복사

- `copyOf(array, newLength)`: 지정된 길이로 배열 복사
- `copyOfRange(array, from, to)`: 지정된 범위의 배열 복사
- `copyOfRange(array, from, to, newType)`: 다른 타입으로 복사

### 배열 채우기

- `fill(array, value)`: 배열을 특정 값으로 채움
- `fill(array, fromIndex, toIndex, value)`: 배열의 일부분만 채움
- `setAll(array, generator)`: 함수형 인터페이스로 생성된 값으로 채움
- `parallelSetAll(array, generator)`: 병렬 처리로 채움
- `parallelPrefix(array, operator)`: 누적 연산 결과로 채움

### 배열 비교

- `equals(array1, array2)`: 두 배열 내용 비교
- `deepEquals(Object[], Object[])`: 다차원 배열 비교
- `compare(array1, array2)`: 사전식 순서로 두 배열 비교
- `compareUnsigned(array1, array2)`: 부호 없는 값으로 비교
- `mismatch(array1, array2)`: 첫 번째 불일치 위치 반환

### 문자열 변환

- `toString(array)`: 1차원 배열의 내용을 문자열로 변환
- `deepToString(Object[])`: 다차원 배열을 문자열로 변환
- `hashCode(array)`: 배열 내용 기반 해시코드 계산
- `deepHashCode(Object[])`: 다차원 배열 해시코드 계산

### 기타 배열 조작

- `asList(array)`: 배열을 고정 크기 List로 변환
- `spliterator(array)`: 배열에 대한 Spliterator 생성
- `stream(array)`: 배열로부터 스트림 생성
- `stream(array, start, end)`: 배열의 일부로부터 스트림 생성
- `parallelPrefix(array, op)`: 누적 연산 수행

### 타입별 오버로딩

대부분의 메서드는 다음 타입들에 대해 오버로딩되어 있다:

- `byte[]`
- `char[]`
- `short[]`
- `int[]`
- `long[]`
- `float[]`
- `double[]`
- `boolean[]`
- `Object[]` (참조 타입 배열)

### 사용 예시

```java
import java.util.Arrays;

public class ArraysExample {
    public static void main(String[] args) {
        int[] numbers = {5, 2, 9, 1, 5};

        // 정렬
        Arrays.sort(numbers);
        System.out.println(Arrays.toString(numbers));  // [1, 2, 5, 5, 9]

        // 이진 검색
        int index = Arrays.binarySearch(numbers, 5);
        System.out.println("5의 인덱스: " + index);

        // 배열 복사
        int[] copy = Arrays.copyOf(numbers, numbers.length);
        System.out.println("복사본: " + Arrays.toString(copy));

        // 배열 비교
        System.out.println("원본과 복사본 같은가? " + Arrays.equals(numbers, copy));

        // 배열 채우기
        Arrays.fill(copy, 10);
        System.out.println("채운 후: " + Arrays.toString(copy));

        // 부분 채우기
        int[] partial = Arrays.copyOf(numbers, numbers.length);
        Arrays.fill(partial, 1, 3, 20);
        System.out.println("부분 채운 후: " + Arrays.toString(partial));
    }
}
```

출력 결과:

```text
[1, 2, 5, 5, 9]
5의 인덱스: 2
복사본: [1, 2, 5, 5, 9]
원본과 복사본 같은가? true
채운 후: [10, 10, 10, 10, 10]
부분 채운 후: [1, 20, 20, 5, 9]
```
