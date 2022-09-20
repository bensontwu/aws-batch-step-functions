#!/bin/bash

FILE_NAME="${JOB_ID}.csv"
aws s3 cp "s3://${BATCH_JOB_MANIFEST_BUCKET_NAME}/${FILE_NAME}" $FILE_NAME
LINE=$((AWS_BATCH_JOB_ARRAY_INDEX + 1))
JOB=$(sed -n ${LINE}p $FILE_NAME)
echo "Received job:" $JOB

echo "Multiplying input..."
product=1
for int in $(echo $JOB | tr ',' '\n')
do
    product=$((product * int))
done

echo "Result: ${product}!"