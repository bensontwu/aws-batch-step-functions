FROM amazon/aws-cli

COPY ./run_job.sh ./run_job.sh
RUN chmod +755 ./run_job.sh

ENTRYPOINT [ "./run_job.sh" ]