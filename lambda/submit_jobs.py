from io import BytesIO
import os
import boto3
from typing import List
from uuid import uuid4

BATCH_JOB_MANIFEST_BUCKET_NAME = os.environ["BATCH_JOB_MANIFEST_BUCKET_NAME"]

s3 = boto3.client("s3")


def upload_to_aws(buffer, s3_file) -> str:
    s3.upload_fileobj(buffer, BATCH_JOB_MANIFEST_BUCKET_NAME, s3_file)
    url = s3.generate_presigned_url(
        ClientMethod="get_object",
        Params={
            "Bucket": BATCH_JOB_MANIFEST_BUCKET_NAME,
            "Key": s3_file
        },
        ExpiresIn=24 * 3600
    )

    print("Upload Successful", url)
    return url


def get_multiplication_jobs() -> List[List[int]]:
    return [[1, 2, 3, 4], [5, 6], [7, 8, 9]]


def write_multiplication_jobs(buffer: bytes, jobs: List[List[int]]) -> None:
    # write jobs to csv
    for job in jobs:
        job_entry = ",".join([str(j) for j in job]) + "\n"
        data = bytes(job_entry, "utf-8")
        buffer.write(data)
    
        
def rewind_buffer(buffer) -> None:
    buffer.seek(0)


def lambda_handler(event, context):
    # unique id to identify the array job
    array_job_id = str(uuid4())
    
    # get jobs
    jobs = get_multiplication_jobs()
    
    # write split files to buffer
    buffer = BytesIO()
    write_multiplication_jobs(buffer, jobs)
    rewind_buffer(buffer)
    
    # upload
    object_name = f"{array_job_id}.csv"
    upload_to_aws(buffer, object_name)
    
    return {
        "array-job-id": array_job_id,
        "array-job-size": len(jobs)
    }